// pages/MyListings.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Edit, Trash2, Eye, MapPin, Calendar, 
  Shield, MessageCircle, ThumbsUp, AlertCircle,
  Search, Filter, X
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { listingsAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import Modal from '../components/common/Modal';
import { COLORS } from '../utils/constants';
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const MyListings = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const colors = COLORS;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, closed
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      setError('');
      // Get all listings and filter by user
      const response = await listingsAPI.getAll();
      const userListings = response.data.filter(
        item => item.user === user?.id
      );
      setListings(userListings);
    } catch (err) {
      console.error('Error fetching listings:', err);
      setError('Failed to load your listings');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Recently';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleDelete = (listing) => {
    setListingToDelete(listing);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!listingToDelete) return;
    
    setDeleting(true);
    try {
      const result = await listingsAPI.delete(listingToDelete.id);
      if (result.status === 204 || result.success) {
        setListings(prev => prev.filter(item => item.id !== listingToDelete.id));
        setDeleteModalOpen(false);
        setListingToDelete(null);
      } else {
        setError(result.error || 'Failed to delete listing');
      }
    } catch (err) {
      setError('An error occurred while deleting');
    } finally {
      setDeleting(false);
    }
  };

  const filteredListings = listings.filter(item => {
    // Filter by status
    if (filter === 'active' && item.status !== 'active') return false;
    if (filter === 'closed' && item.status !== 'closed') return false;
    
    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      return item.title.toLowerCase().includes(search) ||
             item.category?.toLowerCase().includes(search) ||
             item.city?.toLowerCase().includes(search);
    }
    
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader variant="dots" text="Loading your listings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
            My Listings
          </h1>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Manage all your skill exchange listings
          </p>
        </div>
        <Button 
          variant="primary" 
          onClick={() => navigate('/create-listing')}
        >
          <Plus size={18} className="mr-2" />
          Create New Listing
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }} />
          <input
            type="text"
            placeholder="Search your listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none transition"
            style={{
              borderColor: colors.secondary,
              color: colors.text,
              backgroundColor: colors.white
            }}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'all' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: filter === 'all' ? colors.primary : colors.secondary,
              color: filter === 'all' ? colors.white : colors.textSecondary
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'active' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: filter === 'active' ? colors.primary : colors.secondary,
              color: filter === 'active' ? colors.white : colors.textSecondary
            }}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              filter === 'closed' ? 'text-white' : ''
            }`}
            style={{
              backgroundColor: filter === 'closed' ? colors.primary : colors.secondary,
              color: filter === 'closed' ? colors.white : colors.textSecondary
            }}
          >
            Closed
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.secondary }}>
            <AlertCircle size={32} style={{ color: colors.primary }} />
          </div>
          <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
            {listings.length === 0 ? 'No listings created yet' : 'No matching listings'}
          </h3>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            {listings.length === 0 
              ? 'Start sharing your skills by creating your first listing' 
              : 'Try adjusting your filters or search term'}
          </p>
          {listings.length === 0 && (
            <Button 
              variant="primary" 
              className="mt-6"
              onClick={() => navigate('/create-listing')}
            >
              <Plus size={18} className="mr-2" />
              Create Your First Listing
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredListings.map((item, index) => (
            <motion.div
              key={item.id}
              variants={fadeUp}
              initial="hidden"
              animate="show"
              transition={{ delay: index * 0.05 }}
            >
              <Card hoverable>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                      item.type === 'offer' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {item.type === 'offer' ? (
                        <ThumbsUp size={12} />
                      ) : (
                        <MessageCircle size={12} />
                      )}
                      {item.type === 'offer' ? 'Offer' : 'Request'}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      item.status === 'active' 
                        ? 'bg-emerald-50 text-emerald-700' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {item.status === 'active' ? 'Active' : 'Closed'}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold mb-1.5 line-clamp-1" style={{ color: colors.text }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed line-clamp-2" style={{ color: colors.textSecondary }}>
                    {item.description}
                  </p>

                  <div className="flex items-center gap-3 mt-3 text-sm" style={{ color: colors.textSecondary }}>
                    <span className="flex items-center gap-1">
                      <MapPin size={14} style={{ color: colors.primary }} />
                      {item.city || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ 
                      backgroundColor: colors.secondary,
                      color: colors.primary
                    }}>
                      {item.category || 'General'}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs" style={{ color: colors.textSecondary }}>
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(item.created_at)}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {item.radius_km || 'N/A'} km
                    </span>
                  </div>

                  <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t" style={{ borderColor: colors.secondary }}>
                    <button
                      onClick={() => navigate(`/item/${item.id}`)}
                      className="p-2 rounded-lg transition hover:bg-gray-50"
                      style={{ color: colors.textSecondary }}
                      title="View"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => navigate(`/edit-listing/${item.id}`)}
                      className="p-2 rounded-lg transition hover:bg-gray-50"
                      style={{ color: colors.textSecondary }}
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(item)}
                      className="p-2 rounded-lg transition hover:bg-red-50"
                      style={{ color: colors.textSecondary }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setListingToDelete(null);
        }}
        title="Delete Listing"
      >
        <div className="space-y-4">
          <p style={{ color: colors.text }}>
            Are you sure you want to delete "{listingToDelete?.title}"?
          </p>
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            This action cannot be undone. This listing will be permanently removed.
          </p>

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.secondary }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setDeleteModalOpen(false);
                setListingToDelete(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              onClick={confirmDelete}
              disabled={deleting}
              className="flex-1"
              style={{ backgroundColor: '#DC2626', borderColor: '#DC2626' }}
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default MyListings;