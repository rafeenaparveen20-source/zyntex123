import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Key, 
  Eye, 
  EyeOff, 
  Lock, 
  Check, 
  X, 
  AlertCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

interface MustChangePasswordModalProps {
  onSuccess: () => void;
}

export const MustChangePasswordModal: React.FC<MustChangePasswordModalProps> = ({
  onSuccess,
}) => {
  const { changePassword, user } = useAdminAuth();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Criteria calculations
  const isLengthValid = newPassword.length >= 8;
  const hasLetters = /[a-zA-Z]/.test(newPassword);
  const hasNumbersOrSpecial = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(newPassword);
  const isNotDefault = newPassword !== 'Zyntex@2026!';
  const doPasswordsMatch = newPassword === confirmPassword && newPassword.length > 0;

  const isFormValid =
    currentPassword.length > 0 &&
    isLengthValid &&
    hasLetters &&
    hasNumbersOrSpecial &&
    isNotDefault &&
    doPasswordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!currentPassword) {
      setErrorMessage('Please enter your current temporary password.');
      return;
    }

    if (!isLengthValid) {
      setErrorMessage('New password must be at least 8 characters.');
      return;
    }

    if (!hasLetters || !hasNumbersOrSpecial) {
      setErrorMessage('New password must contain both letters and numbers/special characters.');
      return;
    }

    if (!isNotDefault) {
      setErrorMessage('You cannot reuse the default temporary password. Please choose a custom password.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        onSuccess();
      } else {
        setErrorMessage(res.error || 'Failed to update password. Please check your current password.');
      }
    } catch (err) {
      setErrorMessage('An unexpected server error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-lg bg-[#fbfaf6] border border-[#ddd8cc] rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Banner */}
        <div className="bg-[#173c2d] px-6 py-5 text-white flex items-center gap-3">
          <div className="p-2.5 bg-[#235440] rounded-xl text-[#e5d8b8]">
            <ShieldAlert className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-400 text-[#173c2d]">
                Mandatory Security Step
              </span>
            </div>
            <h2 className="font-playfair text-xl font-bold text-white mt-1">
              Set Permanent Admin Password
            </h2>
          </div>
        </div>

        {/* Content & Explanation */}
        <div className="p-6 sm:p-7 space-y-5">
          <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-xs text-amber-900 leading-relaxed flex items-start gap-2.5">
            <Key className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950 mb-0.5">
                First-Time Login Security Requirement
              </p>
              <p>
                Your administrator account ({user?.email || 'admin@zyntex.com'}) was initialized with a temporary password.
                To protect store data and customer records, you must set a permanent password before accessing the admin dashboard.
              </p>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current temporary password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#20251f] mb-1">
                Current Temporary Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter initial temporary password (Zyntex@2026!)"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#ddd8cc] rounded-xl text-sm text-[#20251f] focus:outline-none focus:border-[#173c2d]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a9b82] hover:text-[#173c2d] cursor-pointer"
                  aria-label={showCurrent ? 'Hide current password' : 'Show current password'}
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New permanent password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#20251f] mb-1">
                New Permanent Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#ddd8cc] rounded-xl text-sm text-[#20251f] focus:outline-none focus:border-[#173c2d]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a9b82] hover:text-[#173c2d] cursor-pointer"
                  aria-label={showNew ? 'Hide new password' : 'Show new password'}
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm new password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#20251f] mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your new password"
                  className="w-full pl-3 pr-10 py-2.5 bg-white border border-[#ddd8cc] rounded-xl text-sm text-[#20251f] focus:outline-none focus:border-[#173c2d]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#8a9b82] hover:text-[#173c2d] cursor-pointer"
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Criteria Checklist */}
            <div className="p-3 bg-[#f3eee2] rounded-xl border border-[#ddd5c2] text-[11px] space-y-1.5 text-[#5c6159]">
              <span className="font-bold text-[#20251f] block mb-1">Password Requirements:</span>
              <div className="flex items-center gap-1.5">
                {isLengthValid ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={isLengthValid ? 'text-emerald-800 font-medium' : ''}>
                  Minimum 8 characters in length
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {hasLetters && hasNumbersOrSpecial ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={hasLetters && hasNumbersOrSpecial ? 'text-emerald-800 font-medium' : ''}>
                  Contains letters and numbers or symbols
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {isNotDefault ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={isNotDefault ? 'text-emerald-800 font-medium' : 'text-amber-700'}>
                  Different from temporary setup password
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {doPasswordsMatch ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <X className="w-3.5 h-3.5 text-gray-400" />
                )}
                <span className={doPasswordsMatch ? 'text-emerald-800 font-medium' : ''}>
                  Both passwords match exactly
                </span>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="w-full mt-2 py-3 px-6 rounded-full bg-[#173c2d] hover:bg-[#235440] text-white font-bold text-sm tracking-wide shadow-lg shadow-[#173c2d]/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Securing & Updating Password on Server...</span>
                </>
              ) : (
                <>
                  <span>Save Permanent Password & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4 text-[#e5d8b8]" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
