// pages/Matches.jsx
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeftRight, MapPin, Calendar, 
  MessageCircle, ThumbsUp, Eye,
  Sparkles, Filter, X, Clock,
  User, Star
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useChat } from '../context/ChatContext';
import { matchesAPI } from '../services/api';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Loader from '../components/common/Loader';
import { COLORS } from '../utils/constants';


const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const Matches = () => {
  const navigate = useNavigate();
  const {  user } = useUser();
  const colors = COLORS;
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, offer, request
  const { startChat } = useChat();
  useEffect(() => {
    fetchMatches();
  }, []);

  const handleMessageClick = async (e, userId) => {
  e.stopPropagation();
  try {
    await startChat(userId);
    navigate('/messages');
  } catch (error) {
    console.error('Error starting chat:', error);
  }
};

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await matchesAPI.getMyMatches();
      setMatches(response.data || []);
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load your matches');
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

  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    
    const listing1 = match.listing1;
    const listing2 = match.listing2;
    
    // Check if user is involved in this match
    const userListing = listing1?.user === user?.id ? listing1 : 
                       listing2?.user === user?.id ? listing2 : null;
    
    if (filter === 'offer') {
      return userListing?.type === 'offer';
    } else if (filter === 'request') {
      return userListing?.type === 'request';
    }
    
    return true;
  });

  const getOtherListing = (match) => {
    const listing1 = match.listing1;
    const listing2 = match.listing2;
    
    // Find the listing that doesn't belong to the current user
    if (listing1?.user !== user?.id) {
      return listing1;
    }
    return listing2;
  };

  const getUserListing = (match) => {
    const listing1 = match.listing1;
    const listing2 = match.listing2;
    
    // Find the listing that belongs to the current user
    if (listing1?.user === user?.id) {
      return listing1;
    }
    return listing2;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader variant="dots" text="Finding your matches..." />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg" style={{ backgroundColor: colors.secondary }}>
            <ArrowLeftRight size={24} style={{ color: colors.primary }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: colors.text }}>
              My Matches
            </h1>
            <p className="text-sm" style={{ color: colors.textSecondary }}>
              Discover items that match your skills and needs
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-6">
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
          All Matches
        </button>
        <button
          onClick={() => setFilter('offer')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'offer' ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: filter === 'offer' ? colors.primary : colors.secondary,
            color: filter === 'offer' ? colors.white : colors.textSecondary
          }}
        >
          My Offers
        </button>
        <button
          onClick={() => setFilter('request')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            filter === 'request' ? 'text-white' : ''
          }`}
          style={{
            backgroundColor: filter === 'request' ? colors.primary : colors.secondary,
            color: filter === 'request' ? colors.white : colors.textSecondary
          }}
        >
          My Requests
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
          {error}
        </div>
      )}

      {/* Matches Grid */}
      {filteredMatches.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.secondary }}>
            <Sparkles size={32} style={{ color: colors.primary }} />
          </div>
          <h3 className="text-xl font-semibold" style={{ color: colors.text }}>
            {matches.length === 0 ? 'No matches found yet' : 'No matching listings'}
          </h3>
          <p className="mt-2" style={{ color: colors.textSecondary }}>
            {matches.length === 0 
              ? 'Create listings and we\'ll find the perfect matches for you!' 
              : 'Try adjusting your filters to see more matches'}
          </p>
          {matches.length === 0 && (
            <Button 
              variant="primary" 
              className="mt-6"
              onClick={() => navigate('/create-listing')}
            >
              Create a Listing
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match, index) => {
            const userListing = getUserListing(match);
            const otherListing = getOtherListing(match);
            
            if (!userListing || !otherListing) return null;
            
            return (
              <motion.div
                key={match.id}
                variants={fadeUp}
                initial="hidden"
                animate="show"
                transition={{ delay: index * 0.05 }}
              >
                <Card hoverable>
                  <div className="p-6">
                    {/* Match Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                          userListing.type === 'offer' 
                            ? 'bg-emerald-50 text-emerald-700' 
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {userListing.type === 'offer' ? (
                            <ThumbsUp size={12} />
                          ) : (
                            <MessageCircle size={12} />
                          )}
                          {userListing.type === 'offer' ? 'Your Offer' : 'Your Request'}
                        </span>
                        <span className="text-xs flex items-center gap-1" style={{ color: colors.textSecondary }}>
                          <Clock size={12} />
                          {formatDate(match.matched_at)}
                        </span>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ 
                        backgroundColor: colors.secondary,
                        color: colors.primary
                      }}>
                        Match #{match.id}
                      </span>
                    </div>

                    {/* Match Items */}
                    <div className="flex items-center gap-4">
                      {/* Your Listing */}
                      <div className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.secondaryLight }}>
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>Your Listing</p>
                        <h4 className="font-semibold text-sm mt-1 line-clamp-1" style={{ color: colors.text }}>
                          {userListing.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: colors.textSecondary }}>
                          <MapPin size={12} />
                          {userListing.city || 'Unknown'}
                        </div>
                      </div>

                      {/* Match Icon */}
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: colors.primary }}>
                          <ArrowLeftRight size={16} className="text-white" />
                        </div>
                      </div>

                      {/* Other Listing */}
                      <div className="flex-1 p-3 rounded-lg" style={{ backgroundColor: colors.secondary }}>
                        <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>Matched With</p>
                        <h4 className="font-semibold text-sm mt-1 line-clamp-1" style={{ color: colors.text }}>
                          {otherListing.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: colors.textSecondary }}>
                          <User size={12} />
                          {otherListing.user_name}
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="mt-4 pt-3 border-t flex flex-wrap items-center justify-between gap-2" style={{ borderColor: colors.secondary }}>
                      <div className="flex items-center gap-3 text-xs" style={{ color: colors.textSecondary }}>
                        <span className="flex items-center gap-1">
                          <MapPin size={12} style={{ color: colors.primary }} />
                          {otherListing.city || 'Unknown'}
                        </span>
                        <span className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ 
                          backgroundColor: colors.secondary,
                          color: colors.primary
                        }}>
                          {otherListing.category || 'General'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => navigate(`/item/${otherListing.id}`)}
                        >
                          <Eye size={14} className="mr-1" />
                          View
                        </Button>
                        <Button 
                          variant="primary" 
                          size="sm"
                          onClick={(e) => handleMessageClick(e, otherListing.user)}
                        >
                          <MessageCircle size={14} className="mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Matches;