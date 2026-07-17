// pages/CreateListing.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, User, MapPin, Info, Rocket, 
  ChevronDown, ArrowRight, ArrowLeft
} from 'lucide-react';
import { listingsAPI } from '../services/api';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Card from '../components/common/Card';
import { COLORS } from '../utils/constants';
import {useUser} from '../context/UserContext';

const CreateListing = () => {
  const navigate = useNavigate();
  const colors  = COLORS;
  const { user } = useUser();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    type: 'offer',
    title: '',
    category: '',
    description: '',
    city: user?.city || '',
    radius_km: 10,
    status: 'active'
  });

  const nextStep = () => setStep(s => Math.min(4, s + 1));
  const prevStep = () => setStep(s => Math.max(1, s - 1));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    // Validate required fields
    if (!formData.title || !formData.category || !formData.description || !formData.city) {
      setError('Please fill in all required fields');
      setLoading(false);
      return;
    }

    try {
      const response = await listingsAPI.create(formData);
      if (response.status === 201 || response.statusText === 'Created') {
        navigate('/browse');
      } else {
        setError(response.error || 'Failed to create listing');
      }
    } catch (err) {
      setError('An error occurred while creating the listing');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Type' },
    { num: 2, title: 'Details' },
    { num: 3, title: 'Location' },
    { num: 4, title: 'Review' },
  ];

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.secondaryLight }}>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Card className="p-8 md:p-10">
          {/* Stepper */}
          <div className="mb-10">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] z-0" style={{ backgroundColor: colors.secondary }}></div>
              {steps.map((s) => {
                const isActive = step === s.num;
                const isPast = step > s.num;
                return (
                  <div key={s.num} className="relative z-10 flex flex-col items-center gap-2 px-2" style={{ backgroundColor: colors.white }}>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors border-2
                        ${isActive ? 'text-white border-0' : isPast ? 'text-white border-0' : ''}`}
                      style={{
                        backgroundColor: (isActive || isPast) ? colors.primary : colors.white,
                        borderColor: (isActive || isPast) ? colors.primary : colors.secondary,
                        color: (isActive || isPast) ? colors.white : colors.textSecondary
                      }}
                    >
                      {isPast ? (
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : s.num}
                    </div>
                    <span 
                      className={`text-xs font-medium`}
                      style={{ color: (isActive || isPast) ? colors.primary : colors.textSecondary }}
                    >
                      {s.num}. {s.title}
                    </span>
                  </div>
                );
              })}
              <div
                className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] z-0 transition-all duration-300"
                style={{ 
                  backgroundColor: colors.primary,
                  width: `${((step - 1) / (steps.length - 1)) * 100}%`
                }}
              ></div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              {error}
            </div>
          )}

          {/* Form Content */}
          <div className="min-h-[400px]">
            {step === 1 && (
              <div className="animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Create a New Listing</h1>
                <p className="mb-8 text-sm" style={{ color: colors.textSecondary }}>Choose the type of listing you want to create.</p>

                <div className="grid gap-4 mb-8">
                  <label 
                    className={`relative flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all
                      ${formData.type === 'offer' ? 'border-2' : 'border'}`}
                    style={{
                      borderColor: formData.type === 'offer' ? colors.primary : colors.secondary,
                      backgroundColor: formData.type === 'offer' ? colors.secondary : colors.white
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
                      <ShoppingBag size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold mb-1" style={{ color: colors.text }}>Offer (I can teach)</h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>Create a listing to offer your skills and services to others.</p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center pt-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                        style={{ borderColor: formData.type === 'offer' ? colors.primary : colors.secondary }}>
                        {formData.type === 'offer' && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="type"
                      value="offer"
                      checked={formData.type === 'offer'}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>

                  <label 
                    className={`relative flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all
                      ${formData.type === 'request' ? 'border-2' : 'border'}`}
                    style={{
                      borderColor: formData.type === 'request' ? colors.primary : colors.secondary,
                      backgroundColor: formData.type === 'request' ? colors.secondary : colors.white
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: colors.secondary, color: colors.primary }}>
                      <User size={24} />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-semibold mb-1" style={{ color: colors.text }}>Request (I need)</h3>
                      <p className="text-sm" style={{ color: colors.textSecondary }}>Create a listing to find someone who can help you.</p>
                    </div>
                    <div className="shrink-0 flex items-center justify-center pt-2">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center`}
                        style={{ borderColor: formData.type === 'request' ? colors.primary : colors.secondary }}>
                        {formData.type === 'request' && <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: colors.primary }}></div>}
                      </div>
                    </div>
                    <input
                      type="radio"
                      name="type"
                      value="request"
                      checked={formData.type === 'request'}
                      onChange={handleChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="flex justify-end mt-12">
                  <Button variant="primary" onClick={nextStep}>
                    Next <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Listing Details</h1>
                <p className="mb-8 text-sm" style={{ color: colors.textSecondary }}>Provide the basic information about your listing.</p>

                <div className="space-y-5">
                  <Input
                    label="Title"
                    name="title"
                    placeholder="e.g. Guitar Lessons for Beginners"
                    value={formData.title}
                    onChange={handleChange}
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                      Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all appearance-none"
                        style={{
                          borderColor: colors.secondary,
                          color: colors.text,
                          backgroundColor: colors.white
                        }}
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="technology">Technology</option>
                        <option value="language">Language</option>
                        <option value="music">Music</option>
                        <option value="cooking">Cooking</option>
                        <option value="sports">Sports</option>
                        <option value="art">Art</option>
                        <option value="academic">Academic</option>
                        <option value="other">Other</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" size={18} style={{ color: colors.textSecondary }} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                      Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe what you can teach or what you need..."
                      rows={4}
                      className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all resize-none"
                      style={{
                        borderColor: colors.secondary,
                        color: colors.text,
                        backgroundColor: colors.white
                      }}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-10 pt-6 border-t" style={{ borderColor: colors.secondary }}>
                  <button 
                    onClick={prevStep} 
                    className="font-medium flex items-center gap-2 px-4 py-2 transition-colors text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <Button variant="primary" onClick={nextStep}>
                    Next <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Location</h1>
                <p className="mb-8 text-sm" style={{ color: colors.textSecondary }}>Where is your listing available?</p>

                <div className="space-y-5">
                  <Input
                    label="City"
                    name="city"
                    placeholder="Enter your city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    icon={<MapPin size={18} />}
                  />

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                      Radius (km)
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        name="radius_km"
                        min="5"
                        max="50"
                        value={formData.radius_km}
                        onChange={handleChange}
                        className="flex-grow h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ 
                          backgroundColor: colors.secondary,
                          accentColor: colors.primary
                        }}
                      />
                      <span className="text-sm font-medium" style={{ color: colors.primary }}>
                        {formData.radius_km} km
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-10 pt-6 border-t" style={{ borderColor: colors.secondary }}>
                  <button 
                    onClick={prevStep} 
                    className="font-medium flex items-center gap-2 px-4 py-2 transition-colors text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <Button variant="primary" onClick={nextStep}>
                    Next <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="animate-in fade-in duration-500">
                <h1 className="text-2xl font-bold mb-2" style={{ color: colors.text }}>Review & Publish</h1>
                <p className="mb-8 text-sm" style={{ color: colors.textSecondary }}>Review your listing before publishing.</p>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg border" style={{ borderColor: colors.secondary }}>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Type</p>
                        <p className="font-medium capitalize" style={{ color: colors.text }}>
                          {formData.type === 'offer' ? 'Offer (I can teach)' : 'Request (I need)'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Category</p>
                        <p className="font-medium capitalize" style={{ color: colors.text }}>
                          {formData.category || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Title</p>
                        <p className="font-medium" style={{ color: colors.text }}>
                          {formData.title || 'Not set'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Location</p>
                        <p className="font-medium" style={{ color: colors.text }}>
                          {formData.city || 'Not set'} ({formData.radius_km} km)
                        </p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-xs" style={{ color: colors.textSecondary }}>Description</p>
                        <p className="font-medium" style={{ color: colors.text }}>
                          {formData.description || 'Not set'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg flex items-start gap-3 border" style={{ 
                    backgroundColor: colors.secondary,
                    borderColor: colors.primary
                  }}>
                    <Info size={18} style={{ color: colors.primary }} />
                    <p className="text-xs" style={{ color: colors.textSecondary }}>
                      By publishing, you agree to our Terms of Service and Community Guidelines.
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-10 pt-6 border-t" style={{ borderColor: colors.secondary }}>
                  <button 
                    onClick={prevStep} 
                    className="font-medium flex items-center gap-2 px-4 py-2 transition-colors text-sm"
                    style={{ color: colors.textSecondary }}
                  >
                    <ArrowLeft size={18} /> Back
                  </button>
                  <Button 
                    variant="primary" 
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? 'Publishing...' : 'Publish Listing'} 
                    <Rocket size={16} />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateListing;