import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { COLORS } from '../../utils/constants';

const SecuritySettings = () => {
  const { 
    changePassword,
    
  } = useUser();
  const colors = COLORS;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPasswordModal, setIsPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
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
    if (!passwordData.current_password) errors.current_password = 'Current password is required';
    if (!passwordData.new_password) errors.new_password = 'New password is required';
    if (passwordData.new_password.length < 6) errors.new_password = 'Password must be at least 6 characters';
    if (passwordData.new_password !== passwordData.confirm_password) {
      errors.confirm_password = 'Passwords do not match';
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
      current_password: passwordData.current_password,
      new_password: passwordData.new_password
    });

    setLoading(false);
    if (result.success) {
      setSuccess('Password changed successfully!');
      setPasswordData({
        current_password: '',
        new_password: '',
        confirm_password: ''
      });
      setTimeout(() => {
        setIsPasswordModal(false);
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Failed to change password');
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
            backgroundColor: colors.success || '#10B981',
            color: '#FFFFFF'
          }}>
            Secure
          </span>
        </div>

        {/* Change Password */}
        <div>
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
      </div>

      {/* Change Password Modal */}
      <Modal
        isOpen={isPasswordModal}
        onClose={() => {
          setIsPasswordModal(false);
          setError('');
          setSuccess('');
          setPasswordData({
            current_password: '',
            new_password: '',
            confirm_password: ''
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
              name="current_password"
              placeholder="Enter current password"
              value={passwordData.current_password}
              onChange={handlePasswordChange}
              error={passwordErrors.current_password}
              required
            />

            <Input
              label="New Password"
              type="password"
              name="new_password"
              placeholder="Enter new password (min 6 characters)"
              value={passwordData.new_password}
              onChange={handlePasswordChange}
              error={passwordErrors.new_password}
              required
            />

            <Input
              label="Confirm New Password"
              type="password"
              name="confirm_password"
              placeholder="Confirm new password"
              value={passwordData.confirm_password}
              onChange={handlePasswordChange}
              error={passwordErrors.confirm_password}
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
                    current_password: '',
                    new_password: '',
                    confirm_password: ''
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