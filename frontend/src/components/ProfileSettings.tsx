import { useState } from 'react';
import { Lock, Mail, LogOut, Check, AlertCircle } from 'lucide-react';
import { api } from '../api/client';

interface ProfileSettingsProps {
  user: any;
  isDark: boolean;
  onLogout: () => void;
  onProfileUpdate?: (user: any) => void;
}

export default function ProfileSettings({
  user,
  isDark,
  onLogout,
  onProfileUpdate
}: ProfileSettingsProps) {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [emailForm, setEmailForm] = useState({
    email: user?.email || '',
    currentPassword: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    newPassword: '',
    confirmPassword: '',
    currentPassword: ''
  });

  const theme = {
    bg: isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200',
    input: isDark ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-300 text-slate-900 placeholder-slate-400',
    text: isDark ? 'text-slate-100' : 'text-slate-900',
    subtext: isDark ? 'text-slate-400' : 'text-slate-500',
    button: 'bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-50'
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!emailForm.currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (emailForm.email === user?.email) {
      setError('Please enter a different email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.admin.updateProfile(
        emailForm.email,
        undefined,
        emailForm.currentPassword
      );

      setSuccess('Email updated successfully');
      
      if (response.user) {
        localStorage.setItem('admin_user', JSON.stringify(response.user));
        onProfileUpdate?.(response.user);
      }

      setEmailForm({ email: response.user?.email || '', currentPassword: '' });
      setTimeout(() => setShowForm(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update email');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!passwordForm.currentPassword) {
      setError('Please enter your current password');
      return;
    }

    if (!passwordForm.newPassword) {
      setError('Please enter a new password');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const response = await api.admin.updateProfile(
        undefined,
        passwordForm.newPassword,
        passwordForm.currentPassword
      );

      setSuccess('Password updated successfully');
      setPasswordForm({ newPassword: '', confirmPassword: '', currentPassword: '' });
      setTimeout(() => setShowForm(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`rounded-2xl border p-6 ${theme.bg}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={`text-xl font-bold ${theme.text}`}>Profile Settings</h3>
          <p className={`text-sm ${theme.subtext}`}>{user?.email}</p>
        </div>
        <button
          onClick={onLogout}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all`}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${theme.button}`}
        >
          Edit Profile
        </button>
      ) : (
        <div className="mt-6">
          {/* Tab Navigation */}
          <div className="flex gap-4 mb-6 border-b border-slate-700">
            <button
              onClick={() => {
                setActiveTab('email');
                setError(null);
                setSuccess(null);
              }}
              className={`pb-3 font-semibold transition-colors ${
                activeTab === 'email'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : `${theme.subtext} hover:${theme.text}`
              }`}
            >
              <Mail className="inline mr-2" size={18} />
              Change Email
            </button>
            <button
              onClick={() => {
                setActiveTab('password');
                setError(null);
                setSuccess(null);
              }}
              className={`pb-3 font-semibold transition-colors ${
                activeTab === 'password'
                  ? 'text-orange-500 border-b-2 border-orange-500'
                  : `${theme.subtext} hover:${theme.text}`
              }`}
            >
              <Lock className="inline mr-2" size={18} />
              Change Password
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-start gap-2 text-red-500">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-start gap-2 text-green-500">
              <Check size={20} className="flex-shrink-0 mt-0.5" />
              <span className="text-sm">{success}</span>
            </div>
          )}

          {/* Email Form */}
          {activeTab === 'email' && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>
                  New Email Address
                </label>
                <input
                  type="email"
                  value={emailForm.email}
                  onChange={(e) => setEmailForm({ ...emailForm, email: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${theme.input}`}
                  placeholder="your.email@example.com"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={emailForm.currentPassword}
                  onChange={(e) => setEmailForm({ ...emailForm, currentPassword: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${theme.input}`}
                  placeholder="Enter your password to confirm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${theme.button}`}
                >
                  {loading ? 'Updating...' : 'Update Email'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} ${theme.text}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Password Form */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${theme.input}`}
                  placeholder="Enter new password"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${theme.input}`}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-semibold mb-2 ${theme.text}`}>
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  className={`w-full px-4 py-2 rounded-lg border outline-none transition-all ${theme.input}`}
                  placeholder="Enter your current password to confirm"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${theme.button}`}
                >
                  {loading ? 'Updating...' : 'Update Password'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setError(null);
                    setSuccess(null);
                  }}
                  className={`px-6 py-2 rounded-lg font-semibold transition-all ${isDark ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'} ${theme.text}`}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
