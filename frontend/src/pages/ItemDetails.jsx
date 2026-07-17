// pages/ItemDetails.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, MapPin, Calendar, Shield, 
  MessageCircle, ThumbsUp, User, Heart,
  Share2, Flag, Star, Clock, CheckCircle, X, Edit
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import {useChat} from '../context/ChatContext';
import { listingsAPI, moderationAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';
import { COLORS } from '../utils/constants';
import defaultPfp from '../assets/defaultpfp.png';

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { startChat } = useChat();
  const colors = COLORS;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  
  // Report Modal States
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  // const [reportDescription, setReportDescription] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');
  const [reportSuccess, setReportSuccess] = useState('');

  const reportReasons = [
    { value: 'spam', label: 'Spam' },
    { value: 'inappropriate', label: 'Inappropriate' },
    { value: 'fake', label: 'Fake Listing' },
    { value: 'other', label: 'Other' },
  ];

  const [editForm, setEditForm] = useState({
    title: '',
    category: '',
    description: '',
    city: '',
    radius_km: 10,
    status: 'active',
    type: 'offer'
  });

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await listingsAPI.getOne(id);
      setListing(response.data);
      setEditForm({
        title: response.data.title || '',
        category: response.data.category || '',
        description: response.data.description || '',
        city: response.data.city || '',
        radius_km: response.data.radius_km || 10,
        status: response.data.status || 'active',
        type: response.data.type || 'offer'
      });
    } catch (err) {
      console.error('Error fetching listing:', err);
      setError('Failed to load listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async (e) => {
    e.preventDefault();
    if (!reportReason) {
      setReportError('Please select a reason');
      return;
    }

    setReportLoading(true);
    setReportError('');
    setReportSuccess('');

    try {
      const response = await moderationAPI.reportContent(listing.id, {
        listing: listing.id,
        reason: reportReason,
        // description: reportDescription
      });
      
      if (response.status === 201 || response.status === 200 || response.success) {
        setReportSuccess('Report submitted successfully! Thank you for helping keep our community safe.');
        setTimeout(() => {
          setIsReportModalOpen(false);
          setReportSuccess('');
          setReportReason('');
          // setReportDescription('');
        }, 2000);
      } else {
        setReportError(response.error || 'Failed to submit report');
      }
    } catch (err) {
      console.error('Error submitting report:', err);
      setReportError('An error occurred while submitting your report');
    } finally {
      setReportLoading(false);
    }
  };

  const handleMessage = async (e) => {
    e.stopPropagation();
    try {
      await startChat(listing.user);
      navigate('/messages');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: listing?.title,
        text: listing?.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
    setEditError('');
    setEditSuccess('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError('');
    setEditSuccess('');

    try {
      const result = await listingsAPI.update(id, editForm);
      if (result.status === 200 || result.status === 204 || result.success) {
        setEditSuccess('Listing updated successfully!');
        setListing(result.data);
        setTimeout(() => {
          setIsEditModalOpen(false);
          setEditSuccess('');
        }, 1500);
      } else {
        setEditError(result.error || 'Failed to update listing');
      }
    } catch (err) {
      setEditError('An error occurred while updating the listing');
    } finally {
      setEditLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const openEditModal = () => {
    setEditForm({
      title: listing.title || '',
      category: listing.category || '',
      description: listing.description || '',
      city: listing.city || '',
      radius_km: listing.radius_km || 10,
      status: listing.status || 'active',
      type: listing.type || 'offer'
    });
    setEditError('');
    setEditSuccess('');
    setIsEditModalOpen(true);
  };

  const openReportModal = () => {
    setReportReason('');
    // setReportDescription('');
    setReportError('');
    setReportSuccess('');
    setIsReportModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader variant="dots" text="Loading listing details..." />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.secondary }}>
          <AlertCircle size={32} style={{ color: colors.primary }} />
        </div>
        <h3 className="text-xl font-semibold" style={{ color: colors.text }}>Listing not found</h3>
        <p className="mt-2" style={{ color: colors.textSecondary }}>The listing you're looking for doesn't exist or has been removed.</p>
        <Button 
          variant="primary" 
          className="mt-6"
          onClick={() => navigate('/browse')}
        >
          Browse Listings
        </Button>
      </div>
    );
  }

  const isOwner = user?.id === listing.user;

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/browse')}
          className="flex items-center gap-2 text-sm font-medium transition-colors mb-6"
          style={{ color: colors.textSecondary }}
        >
          <ArrowLeft size={18} />
          Back to Browse
        </button>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <Card>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                    listing.type === 'offer' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-blue-50 text-blue-700'
                  }`}>
                    {listing.type === 'offer' ? (
                      <ThumbsUp size={12} />
                    ) : (
                      <MessageCircle size={12} />
                    )}
                    {listing.type === 'offer' ? 'Offer' : 'Request'}
                  </span>
                  <div className="flex items-center gap-2">
                    {/* <button
                      onClick={handleSave}
                      className="p-2 rounded-lg transition"
                      style={{ 
                        backgroundColor: isSaved ? colors.primary : colors.secondary,
                        color: isSaved ? colors.white : colors.textSecondary
                      }}
                    >
                      <Heart size={18} fill={isSaved ? 'currentColor' : 'none'} />
                    </button> */}
                    <button
                      onClick={handleShare}
                      className="p-2 rounded-lg transition"
                      style={{ backgroundColor: colors.secondary, color: colors.textSecondary }}
                    >
                      <Share2 size={18} />
                    </button>
                    {isOwner && (
                      <button
                        onClick={openEditModal}
                        className="p-2 rounded-lg transition flex items-center gap-1"
                        style={{ backgroundColor: colors.secondary, color: colors.primary }}
                      >
                        <Edit size={16} />
                        <span className="text-xs font-medium">Edit</span>
                      </button>
                    )}
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: colors.text }}>
                  {listing.title}
                </h1>

                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
                    <MapPin size={16} style={{ color: colors.primary }} />
                    {listing.city || 'Unknown location'}
                  </span>
                  <span className="flex items-center gap-1 text-sm" style={{ color: colors.textSecondary }}>
                    <Calendar size={16} style={{ color: colors.primary }} />
                    Posted {formatDate(listing.created_at)}
                  </span>
                  <span className={`flex items-center gap-1 text-sm px-2 py-0.5 rounded-full ${
                    listing.status === 'active' 
                      ? 'bg-emerald-50 text-emerald-700' 
                      : 'bg-gray-100 text-gray-500'
                  }`}>
                    <Shield size={14} />
                    {listing.status === 'active' ? 'Active' : 'Closed'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                    backgroundColor: colors.secondary,
                    color: colors.primary
                  }}>
                    {listing.category || 'General'}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                    backgroundColor: colors.secondary,
                    color: colors.primary
                  }}>
                    {listing.radius_km || 'N/A'} km radius
                  </span>
                </div>

                <div className="border-t pt-4" style={{ borderColor: colors.secondary }}>
                  <h3 className="text-sm font-semibold mb-2" style={{ color: colors.text }}>Description</h3>
                  <p className="text-sm leading-relaxed" style={{ color: colors.textSecondary }}>
                    {listing.description}
                  </p>
                </div>
              </div>
            </Card>

            {/* Additional Info */}
            <Card>
              <div className="p-6">
                <h3 className="text-sm font-semibold mb-4" style={{ color: colors.text }}>Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Type</p>
                    <p className="text-sm font-medium capitalize" style={{ color: colors.text }}>
                      {listing.type === 'offer' ? 'Offer (I can teach)' : 'Request (I need)'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Category</p>
                    <p className="text-sm font-medium capitalize" style={{ color: colors.text }}>
                      {listing.category || 'General'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Location</p>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>
                      {listing.city || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Radius</p>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>
                      {listing.radius_km || 'N/A'} km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Status</p>
                    <p className="text-sm font-medium capitalize" style={{ color: colors.text }}>
                      {listing.status || 'Active'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs" style={{ color: colors.textSecondary }}>Posted</p>
                    <p className="text-sm font-medium" style={{ color: colors.text }}>
                      {formatDate(listing.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* User Card */}
            <Card>
              <div className="p-6 text-center">
                <div className="w-20 h-20 rounded-full flex-shrink-0 overflow-hidden border-2 mx-auto" style={{ borderColor: colors.primary }}>
                  <img 
                    src={listing.user_photo || defaultPfp}
                    alt={listing.createdby || 'User'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = defaultPfp;
                    }}
                  />
                </div>
                <h4 className="mt-3 font-semibold" style={{ color: colors.text }}>
                  {listing.user_name}
                </h4>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Member since {formatDate(listing.created_at)}
                </p>

                <div className="mt-4 space-y-2">
                  {!isOwner && listing.status === 'active' && (
                    <Button 
                      variant="primary" 
                      fullWidth
                      onClick={handleMessage}
                    >
                      <MessageCircle size={18} className="mr-2" />
                      Message
                    </Button>
                  )}
                  {isOwner && (
                    <>
                      <Button 
                        variant="secondary" 
                        fullWidth
                        onClick={openEditModal}
                      >
                        <Edit size={18} className="mr-2" />
                        Edit Listing
                      </Button>
                      <Button 
                        variant="secondary" 
                        fullWidth
                        onClick={() => navigate('/my-listings')}
                      >
                        View All My Listings
                      </Button>
                    </>
                  )}
                  
                </div>
              </div>
            </Card>

            {/* Report Button */}
            {!isOwner && (
              <button
                className="w-full text-center text-sm hover:underline transition-colors py-2"
                style={{ color: colors.textSecondary }}
                onClick={openReportModal}
              >
                <Flag size={14} className="inline mr-1" />
                Report this listing
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit Listing Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditError('');
          setEditSuccess('');
        }}
        title="Edit Listing"
        size="lg"
      >
        <form onSubmit={handleEditSubmit}>
          <div className="space-y-4">
            {editError && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                {editError}
              </div>
            )}
            {editSuccess && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                {editSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label 
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                    editForm.type === 'offer' ? 'border-2' : 'border'
                  }`}
                  style={{
                    borderColor: editForm.type === 'offer' ? colors.primary : colors.secondary,
                    backgroundColor: editForm.type === 'offer' ? colors.secondary : colors.white
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="offer"
                    checked={editForm.type === 'offer'}
                    onChange={handleEditChange}
                    className="hidden"
                  />
                  <span className="text-sm" style={{ color: colors.text }}>Offer</span>
                </label>
                <label 
                  className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition ${
                    editForm.type === 'request' ? 'border-2' : 'border'
                  }`}
                  style={{
                    borderColor: editForm.type === 'request' ? colors.primary : colors.secondary,
                    backgroundColor: editForm.type === 'request' ? colors.secondary : colors.white
                  }}
                >
                  <input
                    type="radio"
                    name="type"
                    value="request"
                    checked={editForm.type === 'request'}
                    onChange={handleEditChange}
                    className="hidden"
                  />
                  <span className="text-sm" style={{ color: colors.text }}>Request</span>
                </label>
              </div>
            </div>

            <Input
              label="Title"
              name="title"
              placeholder="Enter title"
              value={editForm.title}
              onChange={handleEditChange}
              required
            />

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Category
              </label>
              <select
                name="category"
                value={editForm.category}
                onChange={handleEditChange}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all"
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
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Description
              </label>
              <textarea
                name="description"
                value={editForm.description}
                onChange={handleEditChange}
                rows="4"
                placeholder="Describe your listing"
                className="w-full rounded-lg border px-4 py-3 text-sm outline-none transition-all resize-none"
                style={{
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.white
                }}
                required
              />
            </div>

            <Input
              label="City"
              name="city"
              placeholder="Enter city"
              value={editForm.city}
              onChange={handleEditChange}
              required
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
                  value={editForm.radius_km}
                  onChange={handleEditChange}
                  className="flex-grow h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ 
                    backgroundColor: colors.secondary,
                    accentColor: colors.primary
                  }}
                />
                <span className="text-sm font-medium" style={{ color: colors.primary }}>
                  {editForm.radius_km} km
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Status
              </label>
              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.white
                }}
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.secondary }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditError('');
                  setEditSuccess('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={editLoading}
                className="flex-1"
              >
                {editLoading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Report Modal */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => {
          setIsReportModalOpen(false);
          setReportError('');
          setReportSuccess('');
          setReportReason('');
          // setReportDescription('');
        }}
        title="Report Listing"
        size="md"
      >
        <form onSubmit={handleReport}>
          <div className="space-y-4">
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Please let us know why you're reporting this listing. This helps us keep our community safe.
            </p>

            {reportError && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                {reportError}
              </div>
            )}
            {reportSuccess && (
              <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
                {reportSuccess}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: colors.text }}>
                Reason <span className="text-red-500">*</span>
              </label>
              <select
                value={reportReason}
                onChange={(e) => {
                  setReportReason(e.target.value);
                  setReportError('');
                }}
                className="w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-all"
                style={{
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.white
                }}
                required
              >
                <option value="">Select a reason</option>
                {reportReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
            </div>

            

            <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.secondary }}>
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsReportModalOpen(false);
                  setReportError('');
                  setReportSuccess('');
                  setReportReason('');
                  // setReportDescription('');
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={reportLoading}
                className="flex-1"
                style={{
                  backgroundColor: '#DC2626',
                  borderColor: '#DC2626'
                }}
                onMouseEnter={(e) => {
                  if (!reportLoading) {
                    e.currentTarget.style.backgroundColor = '#B91C1C';
                    e.currentTarget.style.borderColor = '#B91C1C';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!reportLoading) {
                    e.currentTarget.style.backgroundColor = '#DC2626';
                    e.currentTarget.style.borderColor = '#DC2626';
                  }
                }}
              >
                {reportLoading ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default ItemDetails;