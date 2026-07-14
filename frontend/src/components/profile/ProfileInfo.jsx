import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { COLORS } from '../../utils/constants';

const ProfileInfo = () => {
  const {  userData, setIsProfileInfoModal, isProfileInfoModal, updateProfile } = useUser();
  const colors = COLORS;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    bio: userData.bio,
    name: userData.name,
    created_at: userData.created_at,
    avatar: userData.avatar
  });

  const formatMonthYear = (dateStr) => {
    // Append time to prevent timezone shifting issues
    const date = new Date(`${dateStr}T00:00:00`); 
    
    return date.toLocaleDateString('en-US', {
      month: 'long', // Use 'short' for "Jul", 'long' for "July"
      year: 'numeric' // "2026"
    });
  };

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
    setError('');
    setSuccess('');
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.bio) newErrors.bio = 'Bio is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const result = await updateProfile({
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`
    });

    setLoading(false);
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        setIsProfileInfoModal(false);
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  };

  return (
    <>
      {/* Profile Display */}
      <div>
        <div className="flex flex-col gap-5 sm:flex-row xl:gap-10">
          <div className="flex-1">
            {/* Profile Header */}
            <div className="mb-6 flex flex-col gap-5 sm:flex-row xl:items-center xl:justify-between">
              <div className="flex w-full flex-col items-start gap-6 sm:flex-row sm:items-center">
                <div className="overflow-hidden rounded-full border-4" style={{ borderColor: colors.primary }}>
                  <img 
                    src={userData.avatar || 'https://via.placeholder.com/80'} 
                    className="w-20 h-20 object-cover" 
                    alt={userData.name} 
                  />
                </div>
                <div className="text-left">
                  <h4 className="mb-1 text-xl font-bold" style={{ color: colors.text }}>
                    {userData.name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-3">
            
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Member Since {formatMonthYear(userData.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile Details Grid */}
            <div className="relative grid max-w-4xl grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4 xl:gap-x-11 xl:gap-y-7">
              <div className="w-full">
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  First Name
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {userData.firstName}
                </p>
              </div>
              <div className="w-full">
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Last Name
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {userData.lastName}
                </p>
              </div>
              <div className="hidden xl:block"></div>
              <div className="hidden xl:block"></div>
              <div>
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Email address
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {userData.email}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Bio
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {userData.bio}
                </p>
              </div>
            </div>
              </div>

          {/* Edit Button */}
          <div>
            <Button
              variant="primary"
              onClick={() => setIsProfileInfoModal(true)}
              className="w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit
            </Button>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isProfileInfoModal}
        onClose={() => {
          setIsProfileInfoModal(false);
          setError('');
          setSuccess('');
        }}
        title="Edit Profile"
      >
        <form onSubmit={handleSubmit}>
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

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
            </div>

            <Input
              label="Email Address"
              type="email"
              name="email"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Bio
              </label>
              <textarea
                name="bio"
                rows="3"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleChange}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors"
                style={{
                  borderColor: errors.bio ? '#EF4444' : colors.secondary,
                  color: colors.text
                }}
              />
              {errors.bio && (
                <p className="mt-1 text-xs" style={{ color: '#EF4444' }}>{errors.bio}</p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsProfileInfoModal(false);
                  setError('');
                  setSuccess('');
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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileInfo;