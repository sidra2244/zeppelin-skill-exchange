import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { COLORS } from '../../utils/constants';

const SecuritySettings = () => {
  const { 
    switcherToggle, 
    setSwitcherToggle,
    isPasswordModal,
    setIsPasswordModal,
    changePassword 
  } = useUser();
  const colors = COLORS;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({
        ...passwordErrors,
        [e.target.name]: ''
      });
    }
    setError('');
    setSuccess('');
  };

  const validatePassword = () => {
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 6) errors.newPassword = 'Password must be at least 6 characters';
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    return errors;
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const errors = validatePassword();
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    });

    setLoading(false);
    if (result.success) {
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setTimeout(() => {
        setIsPasswordModal(false);
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  const handle2FAToggle = async () => {
    try {
      // API call to toggle 2FA
      // await api.post('/auth/2fa/toggle');
      setSwitcherToggle(!switcherToggle);
    } catch (error) {
      console.error('Failed to toggle 2FA:', error);
    }
  };

  return (
    <>
      {/* Security Display */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <h4 className="text-lg font-semibold" style={{ color: colors.text }}>
            Security
          </h4>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
            backgroundColor: colors.success,
            color: '#FFFFFF'
          }}>
            Secure
          </span>
        </div>

        {/* Change Password */}
        <div className="border-b pb-4 mb-4" style={{ borderColor: colors.secondary }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-base font-medium" style={{ color: colors.text }}>
                Change Password
              </span>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Update your password to keep your account secure
              </p>
            </div>
            <div>
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => setIsPasswordModal(true)}
              >
                Change Password
              </Button>
            </div>
          </div>
        </div>

        {/* Two-Factor Authentication */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-medium" style={{ color: colors.text }}>
                  Two-factor authentication (2FA)
                </span>
                {switcherToggle && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                    backgroundColor: colors.success,
                    color: '#FFFFFF'
                  }}>
                    Enabled
                  </span>
                )}
              </div>
              <p className="text-sm" style={{ color: colors.textSecondary }}>
                Keep your account secure by enabling 2FA
              </p>
            </div>
            <div>
              <label className="flex cursor-pointer items-center gap-3 text-sm font-medium select-none" style={{ color: colors.text }}>
                <div className="relative">
                  <input
                    type="checkbox"
                    className="sr-only"
                    onChange={handle2FAToggle}
                    checked={switcherToggle}
                  />
                  <div
                    className={`block h-6 w-11 rounded-full transition-colors duration-200`}
                    style={{ 
                      backgroundColor: switcherToggle ? colors.primary : colors.secondary
                    }}
                  ></div>
                  <div
                    className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200 ${
                      switcherToggle ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  ></div>
                </div>
                <span className="text-sm font-medium">
                  {switcherToggle ? 'Enabled' : 'Disabled'}
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModal}
        onClose={() => {
          setIsPasswordModal(false);
          setError('');
          setSuccess('');
          setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
          setPasswordErrors({});
        }}
        title="Change Password"
      >
        <form onSubmit={handlePasswordSubmit}>
          <div className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                {error}
              </div>
            )}
            {success && (
              <div className="p-3 rounded-lg" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                {success}
              </div>
            )}

            <Input
              label="Current Password"
              type="password"
              name="currentPassword"
              placeholder="Enter current password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.currentPassword}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="newPassword"
              placeholder="Enter new password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.newPassword}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              error={passwordErrors.confirmPassword}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsPasswordModal(false);
                  setError('');
                  setSuccess('');
                  setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                  });
                  setPasswordErrors({});
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="flex-1"
              >
                {loading ? 'Changing...' : 'Change Password'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default SecuritySettings;