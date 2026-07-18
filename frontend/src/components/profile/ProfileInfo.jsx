import React, { useState, useRef } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { COLORS } from '../../utils/constants';

const ProfileInfo = () => {
  const { user, updateProfile } = useUser();
  const colors = COLORS;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);
  
  const [formData, setFormData] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    username: user?.username || '',
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(user?.photo || null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [errors, setErrors] = useState({});

  const formatMonthYear = (dateStr) => {
    if (!dateStr) return 'Recent';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };

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

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setError('');
    }
  };

  const handleRemovePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'First name is required';
    if (!formData.last_name) newErrors.last_name = 'Last name is required';
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

  try {
    const formDataObj = new FormData();
    formDataObj.append('first_name', formData.first_name);
    formDataObj.append('last_name', formData.last_name);
    formDataObj.append('email', formData.email);
    formDataObj.append('bio', formData.bio);
    formDataObj.append('username', formData.username);
    
    if (photoFile) {
      formDataObj.append('photo', photoFile);
    }

    const result = await updateProfile(formDataObj);
    setLoading(false);
    if (result.success) {
      setSuccess('Profile updated successfully!');
      setPhotoFile(null);
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Failed to update profile');
    }
  } catch (err) {
    setLoading(false);
    setError('An error occurred while updating profile');
  }
};

  const handleOpenModal = () => {
    // Reset form data when opening modal
    setFormData({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      username: user?.username || '',
    });
    setPhotoPreview(user?.photo || null);
    setPhotoFile(null);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
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
                <div className="relative">
                  <div className="overflow-hidden rounded-full border-4" style={{ borderColor: colors.primary }}>
                    <img 
                      src={user?.photo ? `https://res.cloudinary.com/${import.meta.env.VITE_CLOUDINARY_DB}/${user.photo}`: "/src/assets/defaultpfp.png"}
             className="w-20 h-20 object-cover" 
                      alt={user?.username || 'User'} 
                    />
                  </div>
                </div>
                <div className="text-left">
                  <h4 className="mb-1 text-xl font-bold" style={{ color: colors.text }}>
                    {user?.first_name} {user?.last_name}
                  </h4>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-3">
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      @{user?.username}
                    </p>
                    <div className="hidden h-3.5 w-px sm:block" style={{ backgroundColor: colors.secondary }}></div>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                      Member Since {formatMonthYear(user?.created_at)}
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
                  {user?.first_name || 'Not set'}
                </p>
              </div>
              <div className="w-full">
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Last Name
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {user?.last_name || 'Not set'}
                </p>
              </div>
              <div className="hidden xl:block"></div>
              <div className="hidden xl:block"></div>
              <div>
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Email address
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {user?.email || 'Not set'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Bio
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {user?.bio || 'No bio yet'}
                </p>
              </div>
            </div>
          </div>

          {/* Edit Button */}
          <div>
            <Button
              variant="primary"
              onClick={handleOpenModal}
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
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError('');
          setSuccess('');
          setPhotoFile(null);
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

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Profile Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img 
                    src={photoPreview || 'https://via.placeholder.com/80'} 
                    className="w-20 h-20 rounded-full object-cover border-2"
                    style={{ borderColor: colors.secondary }}
                    alt="Profile"
                  />
                </div>
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                    id="photo-upload"
                  />
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Upload Photo
                    </Button>
                    {photoPreview && (
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={handleRemovePhoto}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                  <p className="text-xs mt-1" style={{ color: colors.textSecondary }}>
                    JPG, PNG or GIF. Max 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                name="first_name"
                placeholder="Enter first name"
                value={formData.first_name}
                onChange={handleChange}
                error={errors.first_name}
                required
              />
              <Input
                label="Last Name"
                name="last_name"
                placeholder="Enter last name"
                value={formData.last_name}
                onChange={handleChange}
                error={errors.last_name}
                required
              />
            </div>

            <Input
              label="Username"
              type="text"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              error={errors.username}
            />

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
                  setIsModalOpen(false);
                  setError('');
                  setSuccess('');
                  setPhotoFile(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={loading || uploadingPhoto}
                className="flex-1"
              >
                {loading ? 'Saving...' : uploadingPhoto ? 'Uploading Photo...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ProfileInfo;