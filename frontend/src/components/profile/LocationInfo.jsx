import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { COLORS } from '../../utils/constants';

const LocationInfo = () => {
  const { user, updateProfile } = useUser();
  const colors = COLORS;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [formData, setFormData] = useState({
    city: user?.city || '',
    latitude: user?.latitude || '',
    longitude: user?.longitude || ''
  });

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
    if (!formData.city) newErrors.city = 'City is required';
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

    // Only send fields that exist in the backend User model
    const updateData = {};
    if (formData.city) updateData.city = formData.city;
    
    // Note: The current backend User model doesn't have latitude/longitude fields
    // If you want to store them, you'd need to add them to the User model first
    // For now, we'll only update city
    // If latitude/longitude are custom fields, you might need to handle them separately

    const result = await updateProfile(updateData);

    setLoading(false);
    if (result.success) {
      setSuccess('Location updated successfully!');
      setTimeout(() => {
        setIsModalOpen(false);
        setSuccess('');
      }, 1500);
    } else {
      setError(result.error || 'Failed to update location');
    }
  };

  return (
    <>
      {/* Location Display */}
      <div>
        <div className="flex flex-col gap-6 sm:flex-row lg:items-start lg:justify-between">
          <div className="flex-1">
            <h4 className="text-lg font-semibold mb-6" style={{ color: colors.text }}>
              Location
            </h4>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  City
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {user?.city || 'Not set'}
                </p>
              </div>
              <div>
                <p className="mb-2 text-xs leading-normal" style={{ color: colors.textSecondary }}>
                  Country
                </p>
                <p className="text-sm font-medium" style={{ color: colors.text }}>
                  {user?.country || 'Pakistan'}
                </p>
              </div>
            </div>
          </div>

          <div>
            <Button
              variant="primary"
              onClick={() => setIsModalOpen(true)}
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

      {/* Edit Location Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setError('');
          setSuccess('');
        }}
        title="Edit Location"
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

            <Input
              label="City"
              name="city"
              placeholder="Enter your city"
              value={formData.city}
              onChange={handleChange}
              error={errors.city}
              required
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
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

export default LocationInfo;