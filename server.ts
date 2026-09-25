import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure persistent storage directory exists
const DATA_DIR = path.resolve(__dirname, '.data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (err) {
    console.warn('Could not create .data directory, falling back to memory storage', err);
  }
}

const AUTH_FILE = path.resolve(DATA_DIR, 'admin-auth.json');
const ORDERS_FILE = path.resolve(DATA_DIR, 'orders.json');

// --- Cryptographic Password Utilities (PBKDF2) ---
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, storedHash: string): boolean {
  try {
    const computedHash = hashPassword(password, salt);
    const computedBuffer = Buffer.from(computedHash, 'hex');
    const storedBuffer = Buffer.from(storedHash, 'hex');
    if (computedBuffer.length !== storedBuffer.length) {
      return false;
    }
    return crypto.timingSafeEqual(computedBuffer, storedBuffer);
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

// --- Admin Credentials State & Store ---
interface AdminStore {
  email: string;
  salt: string;
  hash: string;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;
  loginCount: number;
}

function loadAdminStore(): AdminStore {
  if (fs.existsSync(AUTH_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(AUTH_FILE, 'utf-8'));
      if (data && data.email && data.hash && data.salt) {
        return data;
      }
    } catch (err) {
      console.warn('Failed reading admin auth file, re-initializing default', err);
    }
  }

  // Initial development admin account
  // Initial Temporary Password: Zyntex@2026!
  // Password is NEVER stored in plain text. Only cryptographic salt and PBKDF2 hash are stored.
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = hashPassword('Zyntex@2026!', salt);
  const initialStore: AdminStore = {
    email: 'admin@zyntex.com',
    salt,
    hash,
    mustChangePassword: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    lastLogin: null,
    loginCount: 0,
  };

  saveAdminStore(initialStore);
  return initialStore;
}

function saveAdminStore(store: AdminStore): void {
  try {
    fs.writeFileSync(AUTH_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Failed persisting admin auth store to disk:', err);
  }
}

let adminStore = loadAdminStore();

// --- Active Sessions Map (Token -> Session Info) ---
interface Session {
  email: string;
  createdAt: number;
  expiresAt: number;
}

const activeSessions = new Map<string, Session>();
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

// Rate-limiting / Brute force protection
interface AttemptRecord {
  count: number;
  firstAttempt: number;
  lockedUntil: number;
}
const failedAttempts = new Map<string, AttemptRecord>();

function isRateLimited(identifier: string): { limited: boolean; waitSeconds?: number } {
  const now = Date.now();
  const record = failedAttempts.get(identifier);
  if (!record) return { limited: false };

  if (record.lockedUntil > now) {
    return { limited: true, waitSeconds: Math.ceil((record.lockedUntil - now) / 1000) };
  }

  // Reset window after 10 minutes
  if (now - record.firstAttempt > 10 * 60 * 1000) {
    failedAttempts.delete(identifier);
    return { limited: false };
  }

  return { limited: false };
}

function recordFailedAttempt(identifier: string) {
  const now = Date.now();
  const record = failedAttempts.get(identifier) || { count: 0, firstAttempt: now, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= 5) {
    // Lock for 60 seconds after 5 failed attempts
    record.lockedUntil = now + 60 * 1000;
  }

  failedAttempts.set(identifier, record);
}

function resetFailedAttempts(identifier: string) {
  failedAttempts.delete(identifier);
}

// Authentication Middleware
function authenticateAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  const token = authHeader.substring(7).trim();
  const session = activeSessions.get(token);

  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired. Please log in again.' });
  }

  // Extend session on activity
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  (req as any).adminSession = session;
  next();
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // --- ADMIN AUTHENTICATION API ENDPOINTS ---

  /**
   * POST /api/admin/login
   * Validates credentials securely on the server.
   * Compares with PBKDF2 hash using timingSafeEqual.
   */
  app.post('/api/admin/login', (req, res) => {
    const { username, email, password } = req.body || {};
    const inputIdentifier = (username || email || '').trim();
    const inputPassword = (password || '').trim();

    if (!inputIdentifier || !inputPassword) {
      return res.status(400).json({ error: 'Username/Email and password are required.' });
    }

    const rateCheck = isRateLimited(inputIdentifier.toLowerCase());
    if (rateCheck.limited) {
      return res.status(429).json({
        error: `Too many failed login attempts. Please wait ${rateCheck.waitSeconds} seconds before trying again.`,
      });
    }

    // Check username/email match (supports 'admin@zyntex.com' or 'admin')
    const matchesEmail =
      inputIdentifier.toLowerCase() === adminStore.email.toLowerCase() ||
      inputIdentifier.toLowerCase() === 'admin';

    if (!matchesEmail) {
      recordFailedAttempt(inputIdentifier.toLowerCase());
      return res.status(401).json({
        error: 'Invalid credentials. Please verify your username/email and password.',
      });
    }

    // Verify password securely on the server
    const isPasswordValid = verifyPassword(inputPassword, adminStore.salt, adminStore.hash);

    if (!isPasswordValid) {
      recordFailedAttempt(inputIdentifier.toLowerCase());
      return res.status(401).json({
        error: 'Invalid credentials. Please verify your username/email and password.',
      });
    }

    // Login successful
    resetFailedAttempts(inputIdentifier.toLowerCase());
    adminStore.lastLogin = new Date().toISOString();
    adminStore.loginCount = (adminStore.loginCount || 0) + 1;
    saveAdminStore(adminStore);

    // Generate secure session token
    const token = crypto.randomBytes(32).toString('hex');
    activeSessions.set(token, {
      email: adminStore.email,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_TTL_MS,
    });

    return res.status(200).json({
      success: true,
      token,
      mustChangePassword: adminStore.mustChangePassword,
      user: {
        email: adminStore.email,
        name: 'Zyntex Store Admin',
        role: 'superadmin',
        lastLogin: adminStore.lastLogin,
      },
    });
  });

  /**
   * GET /api/admin/me
   * Validates current session token.
   */
  app.get('/api/admin/me', authenticateAdmin, (req, res) => {
    return res.status(200).json({
      authenticated: true,
      mustChangePassword: adminStore.mustChangePassword,
      user: {
        email: adminStore.email,
        name: 'Zyntex Store Admin',
        role: 'superadmin',
        lastLogin: adminStore.lastLogin,
        loginCount: adminStore.loginCount,
        passwordLastChanged: adminStore.updatedAt,
      },
    });
  });

  /**
   * POST /api/admin/change-password
   * Allows administrator to change password, and fulfills mandatory first-login password change.
   */
  app.post('/api/admin/change-password', authenticateAdmin, (req, res) => {
    const { currentPassword, newPassword } = req.body || {};

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Both current password and new password are required.' });
    }

    // Verify current password securely on the server
    const isCurrentValid = verifyPassword(currentPassword, adminStore.salt, adminStore.hash);
    if (!isCurrentValid) {
      return res.status(400).json({ error: 'Current password does not match our records.' });
    }

    // Password strength validation
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters in length.' });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({ error: 'New password must be different from current password.' });
    }

    const hasLetters = /[a-zA-Z]/.test(newPassword);
    const hasNumbersOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
    if (!hasLetters || !hasNumbersOrSpecial) {
      return res.status(400).json({
        error: 'New password must contain both letters and numbers or special characters.',
      });
    }

    // Prevent re-using the initial default development password
    if (newPassword === 'Zyntex@2026!') {
      return res.status(400).json({
        error: 'Cannot use the initial temporary password. Please choose a custom secure password.',
      });
    }

    // Generate fresh salt and compute PBKDF2 hash
    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);

    adminStore.salt = newSalt;
    adminStore.hash = newHash;
    adminStore.mustChangePassword = false;
    adminStore.updatedAt = new Date().toISOString();
    saveAdminStore(adminStore);

    return res.status(200).json({
      success: true,
      message: 'Password successfully changed and secured.',
      mustChangePassword: false,
    });
  });

  /**
   * POST /api/admin/logout
   * Invalidates active session token.
   */
  app.post('/api/admin/logout', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      activeSessions.delete(token);
    }
    return res.status(200).json({ success: true, message: 'Logged out successfully.' });
  });

  /**
   * GET /api/admin/status
   * Public health/status indicator for admin service.
   */
  app.get('/api/admin/status', (req, res) => {
    return res.status(200).json({
      service: 'Zyntex Operations Portal',
      status: 'active',
      isTemporaryPasswordActive: adminStore.mustChangePassword,
    });
  });

  // --- VITE MIDDLEWARE / STATIC ASSETS ---
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Zyntex Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
