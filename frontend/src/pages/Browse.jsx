// pages/Browse.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Filter, MapPin,
  X, MessageCircle, ThumbsUp,
  Calendar, Shield,
  Sparkles, Code, Palette, Dumbbell,
  Languages, Wrench, Utensils, Music
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { listingsAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { COLORS } from '../utils/constants';
import { useChat } from '../context/ChatContext';
import defaultPfp from '../assets/defaultpfp.png';


const categories = [
  { id: 'all', label: 'All', icon: Sparkles },
  { id: 'technology', label: 'Technology', icon: Code },
  { id: 'language', label: 'Language', icon: Languages },
  { id: 'music', label: 'Music', icon: Music },
  { id: 'cooking', label: 'Cooking', icon: Utensils },
  { id: 'sports', label: 'Sports', icon: Dumbbell },
  { id: 'art', label: 'Art', icon: Palette },
  { id: 'other', label: 'Other', icon: Wrench }
];

const types = [
  { id: 'all', label: 'All Types' },
  { id: 'offer', label: 'Offers' },
  { id: 'request', label: 'Requests' }
];

const sortOptions = [
  { id: '-created_at', label: 'Newest First' },
  { id: 'created_at', label: 'Oldest First' },
  { id: 'radius_km', label: 'Closest First' }
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

function Browse() {
  const navigate = useNavigate();
  const { user } = useUser();
  const colors = COLORS;
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('-created_at');
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { startChat } = useChat();
  // Build query params
  const buildQueryParams = () => {
    const params = {};
    if (selectedCategory !== 'all') params.category = selectedCategory;
    if (selectedType !== 'all') params.type = selectedType;
    if (sortBy) params.ordering = sortBy;
    return params;
  };
  const handleMessageClick = async (e, userId) => {
    e.stopPropagation();
    try {
      await startChat(userId);
      navigate('/messages');
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };
  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedType, sortBy]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = buildQueryParams();
      const response = await listingsAPI.getAll(params);
      setListings(response.data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedType('all');
    setSortBy('-created_at');
  };



  const handleCardClick = (id) => {
    navigate(`/item/${id}`);
  };





  const totalPages = Math.ceil(listings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentListings = listings.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader variant="dots" text="Loading listings..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
          Browse Listings
        </h1>
        <p className="text-sm" style={{ color: colors.textSecondary }}>
          Find skills to learn or people to connect with
        </p>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            {/* Filter Toggle for Mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2.5 rounded-xl border transition"
              style={{ borderColor: colors.secondary }}
            >
              <Filter size={18} style={{ color: colors.textSecondary }} />
            </button>
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex flex-wrap items-center gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-xl border px-3 py-1.5 text-sm outline-none"
              style={{
                borderColor: colors.secondary,
                color: colors.white,
                backgroundColor: colors.primary
              }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="rounded-xl border px-3 py-1.5 text-sm outline-none"
              style={{
                borderColor: colors.secondary,
                color: colors.white,
                backgroundColor: colors.primary
              }}
            >
              {types.map(type => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="rounded-xl border px-3 py-1.5 text-sm outline-none"
              style={{
                borderColor: colors.secondary,
                color: colors.white,
                backgroundColor: colors.primary
              }}
            >
              {sortOptions.map(option => (
                <option key={option.id} value={option.id}>{option.label}</option>
              ))}
            </select>

            {(selectedCategory !== 'all' || selectedType !== 'all' || sortBy !== '-created_at') && (
              <button
                onClick={clearFilters}
                className="text-sm font-medium flex items-center gap-1"
                style={{ color: colors.primary }}
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>

          {/* Mobile Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden space-y-3 overflow-hidden"
              >
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: colors.secondary,
                    color: colors.text,
                    backgroundColor: colors.secondaryLight
                  }}
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>

                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: colors.secondary,
                    color: colors.text,
                    backgroundColor: colors.secondaryLight
                  }}
                >
                  {types.map(type => (
                    <option key={type.id} value={type.id}>{type.label}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                  style={{
                    borderColor: colors.secondary,
                    color: colors.text,
                    backgroundColor: colors.secondaryLight
                  }}
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>

                <button
                  onClick={clearFilters}
                  className="w-full text-center text-sm font-medium py-2 border rounded-xl transition"
                  style={{
                    borderColor: colors.primary,
                    color: colors.primary
                  }}
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Results */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Showing <span className="font-semibold" style={{ color: colors.text }}>{listings.length}</span> results
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.secondary }}>
              <Filter size={32} style={{ color: colors.primary }} />
            </div>
            <h3 className="text-xl font-semibold" style={{ color: colors.text }}>No listings found</h3>
            <p className="mt-2" style={{ color: colors.textSecondary }}>Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 font-medium hover:underline inline-flex items-center gap-1"
              style={{ color: colors.primary }}
            >
              <X size={14} />
              Clear all filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {currentListings.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={fadeUp}
                  initial="hidden"
                  animate="show"
                  transition={{ delay: index * 0.05 }}
                  onClick={() => handleCardClick(item.id)}
                  className="cursor-pointer"
                >
                  <Card hoverable>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${item.type === 'offer'
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

                      </div>

                      <h3 className="text-lg font-bold mb-1.5 line-clamp-2" style={{ color: colors.text }}>
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

                      <div className="flex items-center justify-between mt-4 pt-3 border-t" style={{ borderColor: colors.secondary }}>
                        <div className="flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full flex-shrink-0 overflow-hidden border-2" style={{ borderColor: colors.primary }}>
                            <img
                              src={item.user_photo || defaultPfp}
                              alt={item.createdby || 'User'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = defaultPfp;
                              }}
                            />
                          </div>
                          <div>
                            <p className="text-sm font-medium line-clamp-1" style={{ color: colors.text }}>
                              {item.user_name}
                            </p>
                          </div>
                        </div>
                        {user && user?.id != item.user && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={(e) => handleMessageClick(e, item.user)}
                          >
                            Message
                          </Button>)
                        }
                      </div>

                      <div className="flex items-center gap-4 mt-3 pt-3 border-t text-xs" style={{
                        borderColor: colors.secondary,
                        color: colors.textSecondary
                      }}>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Shield size={12} style={{ color: colors.primary }} />
                          {item.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} />
                          {item.radius_km || 'N/A'} km
                        </span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-8 pt-4 border-t flex-col sm:flex-row gap-4" style={{ borderColor: colors.secondary }}>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, listings.length)} of {listings.length} results
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                    style={{
                      borderColor: colors.secondary,
                      color: colors.text
                    }}
                  >
                    Previous
                  </button>
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm transition ${currentPage === i + 1
                          ? 'text-white'
                          : 'border'
                        }`}
                      style={currentPage === i + 1 ? {
                        backgroundColor: colors.primary
                      } : {
                        borderColor: colors.secondary,
                        color: colors.text
                      }}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-lg border text-sm disabled:opacity-50 disabled:cursor-not-allowed transition"
                    style={{
                      borderColor: colors.secondary,
                      color: colors.text
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Browse;