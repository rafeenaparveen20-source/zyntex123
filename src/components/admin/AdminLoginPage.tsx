import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  AlertCircle, 
  ArrowLeft, 
  Sparkles, 
  KeyRound,
  CheckCircle2,
  Info
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface AdminLoginPageProps {
  onSuccessRedirect: () => void;
  onBackToStore?: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({
  onSuccessRedirect,
  onBackToStore,
}) => {
  const { login } = useAdminAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDevCredentials, setShowDevCredentials] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!username.trim()) {
      setErrorMessage('Please enter your administrator username or email.');
      return;
    }

    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Validates credentials securely on the server via POST /api/admin/login
      const result = await login(username.trim(), password);

      if (result.success) {
        // Redirection to the admin dashboard (or mandatory password change if first login)
        onSuccessRedirect();
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred while communicating with the server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAutofillDev = () => {
    setUsername('admin@zyntex.com');
    setPassword('Zyntex@2026!');
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#f7f3ea] flex flex-col justify-center items-center px-4 py-12 selection:bg-[#173c2d] selection:text-white relative overflow-hidden">
      {/* Decorative Warm Ambient Background Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#e8e0ce] filter blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#dfe7d8] filter blur-3xl opacity-60 pointer-events-none" />

      {/* Top back navigation */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        {onBackToStore && (
          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#5c6159] hover:text-[#173c2d] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Storefront</span>
          </button>
        )}
        <div className="flex items-center gap-1.5 text-xs text-[#8a9b82] ml-auto">
          <ShieldCheck className="w-4 h-4 text-[#173c2d]" />
          <span>PBKDF2 Server Auth</span>
        </div>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-[#fbfaf6] border border-[#ddd8cc] rounded-3xl shadow-[0_20px_50px_rgba(23,60,45,0.08)] p-7 sm:p-9 relative z-10 transition-all">
        
        {/* Header & Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#173c2d] text-[#e5d8b8] shadow-md mb-3.5">
            <KeyRound className="w-7 h-7" />
          </div>
          <h1 className="font-playfair text-3xl font-bold text-[#173c2d] tracking-tight">
            Zyntex Admin
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#8b6b4d] font-semibold mt-1">
            Store Management Portal
          </p>
          <p className="text-xs text-[#5c6159] mt-2">
            Restricted access for authorized store administrators.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div 
            role="alert"
            className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200/80 text-red-800 text-xs flex items-start gap-2.5 animate-in fade-in slide-in-from-top-1 duration-200"
          >
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-semibold block mb-0.5">Authentication Failed</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Requirement 1: Username / Email Input */}
          <div>
            <label 
              htmlFor="admin-username" 
              className="block text-xs font-bold uppercase tracking-wider text-[#20251f] mb-1.5"
            >
              Username / Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8a9b82]">
                <Mail className="w-4 h-4" />
              </div>
              <input
                id="admin-username"
                type="text"
                autoComplete="username"
                autoFocus
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin@zyntex.com"
                className="w-full pl-10 pr-4 py-3 bg-white border border-[#ddd8cc] rounded-xl text-sm text-[#20251f] placeholder-[#a6ada2] focus:outline-none focus:border-[#173c2d] focus:ring-2 focus:ring-[#173c2d]/10 transition-all"
              />
            </div>
          </div>

          {/* Requirement 1 & 3: Password Input with Show/Hide Option */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label 
                htmlFor="admin-password" 
                className="block text-xs font-bold uppercase tracking-wider text-[#20251f]"
              >
                Password
              </label>
              <span className="text-[11px] text-[#8a9b82]">Protected & Encrypted</span>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8a9b82]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-3 bg-white border border-[#ddd8cc] rounded-xl text-sm text-[#20251f] placeholder-[#a6ada2] focus:outline-none focus:border-[#173c2d] focus:ring-2 focus:ring-[#173c2d]/10 transition-all font-sans"
              />
              {/* Show / Hide Password Button */}
              <button
                type="button"
                id="toggle-password-visibility"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#8a9b82] hover:text-[#173c2d] transition-colors cursor-pointer"
                title={showPassword ? 'Hide password' : 'Show password'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Requirement 2: Login Button */}
          <button
            type="submit"
            id="admin-login-submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-full bg-[#173c2d] hover:bg-[#235440] active:scale-[0.99] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#173c2d]/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Authenticating with Server...</span>
              </>
            ) : (
              <>
                <span>Sign In to Admin Panel</span>
                <span className="text-[#e5d8b8]">→</span>
              </>
            )}
          </button>
        </form>

        {/* Development Helper Card */}
        <div className="mt-7 pt-5 border-t border-[#ddd8cc]">
          <div className="flex items-center justify-between text-xs text-[#5c6159]">
            <span className="font-medium flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#8b6b4d]" />
              Initial Setup Credentials:
            </span>
            <button
              type="button"
              onClick={() => setShowDevCredentials(!showDevCredentials)}
              className="text-[#173c2d] font-bold hover:underline cursor-pointer"
            >
              {showDevCredentials ? 'Hide details' : 'View credentials'}
            </button>
          </div>

          {showDevCredentials && (
            <div className="mt-3 p-3 rounded-xl bg-[#f2eee3] border border-[#d8d0bf] text-xs space-y-1.5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="text-[#5c6159]">Default Username:</span>
                <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#ddd8cc] text-[#173c2d] font-bold">
                  admin@zyntex.com
                </code>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5c6159]">Temporary Password:</span>
                <code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#ddd8cc] text-[#173c2d] font-bold">
                  Zyntex@2026!
                </code>
              </div>
              <div className="pt-2 flex items-center justify-between">
                <span className="text-[11px] text-[#8b6b4d] italic">
                  * First login will prompt mandatory password change.
                </span>
                <button
                  type="button"
                  onClick={handleAutofillDev}
                  className="px-2.5 py-1 bg-[#173c2d] hover:bg-[#255743] text-white text-[11px] font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Autofill Credentials
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Footer Notice */}
        <div className="mt-6 text-center">
          <p className="text-[11px] text-[#8a9b82] flex items-center justify-center gap-1">
            <Sparkles className="w-3 h-3 text-[#8b6b4d]" />
            Encrypted with 100,000-round PBKDF2 SHA-512 hashing
          </p>
        </div>
      </div>
    </div>
  );
};
