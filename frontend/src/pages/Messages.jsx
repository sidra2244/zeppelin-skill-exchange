// src/pages/Messages.jsx
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Send, ArrowLeft, MessageCircle,
  MoreVertical, Paperclip, CheckCheck, UserX,
  AlertTriangle, X, UserCheck
} from 'lucide-react';
import { useUser } from '../context/UserContext';
import { useChat } from '../context/ChatContext';
import { moderationAPI } from '../services/api';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { COLORS } from '../utils/constants';
import defaultPfp from '../assets/defaultpfp.png';

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const colors = COLORS;
  const { 
    rooms, 
    currentRoom, 
    messages, 
    loading, 
    sendMessage, 
    selectRoom,
    sendTyping,
  } = useChat();
  
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isUnblockModalOpen, setIsUnblockModalOpen] = useState(false);
  const [blockLoading, setBlockLoading] = useState(false);
  const [blockError, setBlockError] = useState('');
  const [blockSuccess, setBlockSuccess] = useState('');
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loadingBlocked, setLoadingBlocked] = useState(false);
  
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Load blocked users on mount
  useEffect(() => {
    fetchBlockedUsers();
  }, []);

  const fetchBlockedUsers = async () => {
    try {
      setLoadingBlocked(true);
      const response = await moderationAPI.getBlockedUsers();
      setBlockedUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching blocked users:', error);
    } finally {
      setLoadingBlocked(false);
    }
  };

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsNearBottom(nearBottom);
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  useEffect(() => {
    if (currentRoom) {
      setIsNearBottom(true);
      setTimeout(scrollToBottom, 100);
    }
  }, [currentRoom]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;
    
    const otherParticipant = getOtherParticipant(currentRoom);
    if (otherParticipant && isUserBlocked(otherParticipant.id)) {
      setBlockError('You cannot send messages to a blocked user.');
      setTimeout(() => setBlockError(''), 3000);
      return;
    }
    
    setSending(true);
    await sendMessage(newMessage.trim());
    setNewMessage('');
    setSending(false);
  };

  const handleTyping = (e) => {
    const value = e.target.value;
    setNewMessage(value);

    const otherParticipant = getOtherParticipant(currentRoom);
    if (otherParticipant && isUserBlocked(otherParticipant.id)) {
      return; // Don't send typing indicators to blocked users
    }

    if (value.trim()) {
      sendTyping(true);
    } else {
      sendTyping(false);
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    if (value.trim()) {
      typingTimeoutRef.current = setTimeout(() => {
        sendTyping(false);
      }, 2000);
    }
  };

  const isUserBlocked = (userId) => {
    return blockedUsers.some(blocked => blocked.blocked === userId || blocked.blocked === userId);
  };

  const handleBlockUser = async () => {
    if (!currentRoom) return;
    
    const otherParticipant = getOtherParticipant(currentRoom);
    if (!otherParticipant) return;

    setBlockLoading(true);
    setBlockError('');
    setBlockSuccess('');

    try {
      const response = await moderationAPI.blockUser(otherParticipant.id);
      if (response.status === 200 || response.status === 201 || response.success) {
        setBlockSuccess('User blocked successfully!');
        // Refresh blocked users list
        await fetchBlockedUsers();
        setTimeout(() => {
          setIsBlockModalOpen(false);
          setBlockSuccess('');
          // Optionally close the chat
          selectRoom(null);
        }, 1500);
      } else {
        setBlockError(response.error || 'Failed to block user');
      }
    } catch (err) {
      console.error('Error blocking user:', err);
      setBlockError('An error occurred while blocking the user');
    } finally {
      setBlockLoading(false);
    }
  };

  const handleUnblockUser = async () => {
    if (!currentRoom) return;
    
    const otherParticipant = getOtherParticipant(currentRoom);
    if (!otherParticipant) return;

    setBlockLoading(true);
    setBlockError('');
    setBlockSuccess('');

    try {
      const response = await moderationAPI.unblockUser(otherParticipant.id);
      if (response.status === 200 || response.status === 204 || response.success) {
        setBlockSuccess('User unblocked successfully!');
        // Refresh blocked users list
        await fetchBlockedUsers();
        setTimeout(() => {
          setIsUnblockModalOpen(false);
          setBlockSuccess('');
        }, 1500);
      } else {
        setBlockError(response.error || 'Failed to unblock user');
      }
    } catch (err) {
      console.error('Error unblocking user:', err);
      setBlockError('An error occurred while unblocking the user');
    } finally {
      setBlockLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    }
  };

  const getInitials = (name) => {
    if (!name || name === 'Unknown' || name === '?') return '?';
    return name.charAt(0).toUpperCase();
  };

  const getDisplayName = (room) => {
    if (!room || !room.participants || !user) return 'Unknown';
    
    const otherParticipant = room.participants.find(p => p.id !== user.id);
    
    if (!otherParticipant) return 'Unknown';
    
    if (otherParticipant.username) {
      return otherParticipant.username;
    }
    
    return `User ${otherParticipant.id}`;
  };

  const getOtherParticipant = (room) => {
    if (!room || !room.participants || !user) return null;
    return room.participants.find(p => p.id !== user.id) || null;
  };

  const getUserPhoto = (participant) => {
    if (!participant) return defaultPfp;
    return participant.photo || defaultPfp;
  };

  // Sort rooms by last message time (newest first)
  const sortedRooms = [...rooms].sort((a, b) => {
    const timeA = a.last_message?.timestamp ? new Date(a.last_message.timestamp) : new Date(0);
    const timeB = b.last_message?.timestamp ? new Date(b.last_message.timestamp) : new Date(0);
    return timeB - timeA;
  });

  const filteredRooms = sortedRooms.filter(room => {
    const displayName = getDisplayName(room);
    const search = searchTerm.toLowerCase();
    return displayName.toLowerCase().includes(search);
  });

  const openBlockModal = () => {
    setBlockError('');
    setBlockSuccess('');
    setIsBlockModalOpen(true);
  };

  const openUnblockModal = () => {
    setBlockError('');
    setBlockSuccess('');
    setIsUnblockModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader variant="dots" text="Loading conversations..." />
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-120px)] max-w-6xl mx-auto px-4 py-4">
      <div className="flex h-full gap-4 bg-white rounded-2xl shadow-sm border overflow-hidden" style={{ borderColor: colors.secondary }}>
        {/* Rooms List */}
        <div className={`${currentRoom ? 'hidden md:flex' : 'flex'} flex-col w-full md:w-80 lg:w-96 border-r flex-shrink-0 h-full overflow-hidden`} style={{ borderColor: colors.secondary }}>
          <div className="p-4 border-b flex-shrink-0" style={{ borderColor: colors.secondary }}>
            <h2 className="text-xl font-bold" style={{ color: colors.text }}>Messages</h2>
            <div className="mt-3 relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }} />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border pl-10 pr-4 py-2 text-sm outline-none"
                style={{
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.white
                }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto" style={{ backgroundColor: colors.white }}>
            {filteredRooms.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.secondary }}>
                  <MessageCircle size={24} style={{ color: colors.primary }} />
                </div>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  {searchTerm ? 'No conversations found' : 'No messages yet'}
                </p>
              </div>
            ) : (
              filteredRooms.map((room) => {
                const displayName = getDisplayName(room);
                const otherParticipant = room.participants?.find(p => p.id !== user?.id);
                const photo = getUserPhoto(otherParticipant);
                const lastMessage = room.last_message?.content || 'No messages yet';
                const lastMessageTime = room.last_message?.timestamp;
                const isBlocked = otherParticipant && isUserBlocked(otherParticipant.id);
                
                return (
                  <button
                    key={room.id}
                    onClick={() => selectRoom(room)}
                    className={`w-full flex items-center gap-3 p-4 hover:bg-gray-50 transition ${
                      currentRoom?.id === room.id ? 'bg-gray-50' : ''
                    }`}
                    style={{
                      backgroundColor: currentRoom?.id === room.id ? colors.secondary : 'transparent'
                    }}
                  >
                    <div className="w-12 h-12 rounded-full flex-shrink-0 overflow-hidden border-2" style={{ borderColor: colors.primary }}>
                      <img 
                        src={photo} 
                        alt={displayName}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = defaultPfp;
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="font-medium truncate" style={{ color: colors.text }}>
                        {displayName}
                      </p>
                      <p className="text-sm truncate" style={{ color: isBlocked ? '#DC2626' : colors.textSecondary }}>
                        {isBlocked ? 'Blocked' : lastMessage}
                      </p>
                    </div>
                    {lastMessageTime && !isBlocked && (
                      <span className="text-xs flex-shrink-0" style={{ color: colors.textSecondary }}>
                        {formatTime(lastMessageTime)}
                      </span>
                    )}
                    {isBlocked && (
                      <span className="text-xs px-2 py-1 rounded-full flex-shrink-0" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
                        Blocked
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${currentRoom ? 'flex' : 'hidden md:flex'} flex-1 flex-col h-full overflow-hidden`} style={{ backgroundColor: colors.white }}>
          {currentRoom ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center justify-between p-4 border-b flex-shrink-0" style={{ borderColor: colors.secondary }}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => selectRoom(null)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                    style={{ color: colors.textSecondary }}
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden border-2" style={{ borderColor: colors.primary }}>
                    <img 
                      src={getUserPhoto(currentRoom.participants?.find(p => p.id !== user?.id))}
                      alt={getDisplayName(currentRoom)}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = defaultPfp;
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: colors.text }}>
                      {getDisplayName(currentRoom)}
                    </p>
                    {getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id) && (
                      <p className="text-xs" style={{ color: '#DC2626' }}>Blocked</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id) ? (
                    <button
                      onClick={openUnblockModal}
                      className="p-2 rounded-lg transition hover:bg-green-50"
                      style={{ color: colors.textSecondary }}
                      title="Unblock User"
                    >
                      <UserCheck size={20} style={{ color: '#10B981' }} />
                    </button>
                  ) : (
                    <button
                      onClick={openBlockModal}
                      className="p-2 rounded-lg transition hover:bg-red-50"
                      style={{ color: colors.textSecondary }}
                      title="Block User"
                    >
                      <UserX size={20} />
                    </button>
                  )}
                </div>
              </div>

              {/* Blocked User Warning Banner */}
              {getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id) && (
                <div className="p-3 text-center border-b" style={{ backgroundColor: '#FEF2F2', borderColor: '#FCA5A5' }}>
                  <p className="text-sm" style={{ color: '#DC2626' }}>
                    You have blocked this user. You cannot send or receive messages.
                  </p>
                </div>
              )}

              {/* Messages */}
              <div 
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4" 
                style={{ backgroundColor: colors.white }}
                onScroll={handleScroll}
              >
                {messages.map((msg, index) => {
                  const isOwn = msg.sender?.id === user?.id;
                  const showDate = index === 0 || 
                    new Date(msg.timestamp).toDateString() !== new Date(messages[index - 1]?.timestamp).toDateString();

                  return (
                    <div key={msg.id}>
                      {showDate && (
                        <div className="text-center my-4">
                          <span className="text-xs px-3 py-1 rounded-full" style={{
                            backgroundColor: colors.secondary,
                            color: colors.textSecondary
                          }}>
                            {formatDate(msg.timestamp)}
                          </span>
                        </div>
                      )}
                      <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] ${isOwn ? 'order-2' : 'order-1'}`}>
                          {!isOwn && (
                            <div className="flex items-center gap-2 mb-1">
                              <p className="text-xs font-medium" style={{ color: colors.textSecondary }}>
                                {msg.sender?.username || 'User'}
                              </p>
                            </div>
                          )}
                          <div className={`rounded-lg px-4 py-2 ${isOwn ? 'rounded-br-none' : 'rounded-bl-none'}`}
                            style={{
                              backgroundColor: isOwn ? colors.primary : colors.secondary,
                              color: isOwn ? colors.white : colors.text
                            }}
                          >
                            <p className="text-sm break-words">{msg.content}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <p className="text-xs" style={{ color: colors.textSecondary }}>
                              {formatTime(msg.timestamp)}
                            </p>
                            {isOwn && msg.is_read && (
                              <CheckCheck size={14} style={{ color: colors.primary }} />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input - Disabled if blocked */}
              <div className="p-4 border-t flex-shrink-0" style={{ borderColor: colors.secondary, backgroundColor: colors.secondaryLight }}>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id) 
                      ? "You cannot message a blocked user" 
                      : "Type a message..."
                    }
                    value={newMessage}
                    onChange={handleTyping}
                    disabled={getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id)}
                    className="flex-1 rounded-lg border px-4 py-2 text-sm outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      borderColor: colors.secondary,
                      color: colors.text,
                      backgroundColor: getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id) 
                        ? colors.secondary 
                        : colors.white
                    }}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending || (getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id))}
                    className="p-2 rounded-lg transition disabled:opacity-50"
                    style={{
                      backgroundColor: newMessage.trim() && !(getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id)) 
                        ? colors.primary 
                        : colors.secondary,
                      color: newMessage.trim() && !(getOtherParticipant(currentRoom) && isUserBlocked(getOtherParticipant(currentRoom).id)) 
                        ? colors.white 
                        : colors.textSecondary
                    }}
                  >
                    <Send size={20} />
                  </button>
                </form>
                {blockError && (
                  <p className="text-xs mt-2" style={{ color: '#DC2626' }}>{blockError}</p>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: colors.white }}>
              <div className="text-center">
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: colors.secondary }}>
                  <MessageCircle size={32} style={{ color: colors.primary }} />
                </div>
                <h3 className="text-lg font-semibold" style={{ color: colors.text }}>
                  Select a conversation
                </h3>
                <p className="text-sm" style={{ color: colors.textSecondary }}>
                  Choose a chat from the list or start a new one
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Block User Modal */}
      <Modal
        isOpen={isBlockModalOpen}
        onClose={() => {
          setIsBlockModalOpen(false);
          setBlockError('');
          setBlockSuccess('');
        }}
        title="Block User"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#FEF2F2' }}>
            <AlertTriangle size={24} style={{ color: '#DC2626' }} />
            <p className="text-sm" style={{ color: '#DC2626' }}>
              Are you sure you want to block <strong>{currentRoom ? getDisplayName(currentRoom) : 'this user'}</strong>?
            </p>
          </div>

          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Blocking this user will:
          </p>
          <ul className="text-sm space-y-2" style={{ color: colors.textSecondary }}>
            <li className="flex items-center gap-2">
              <X size={16} style={{ color: '#DC2626' }} />
              Prevent them from sending you messages
            </li>
            
            <li className="flex items-center gap-2">
              <X size={16} style={{ color: '#DC2626' }} />
              Hide their listings from your view
            </li>
          </ul>

          <p className="text-sm" style={{ color: colors.textSecondary }}>
            You can unblock them later from your settings or from this chat.
          </p>

          {blockError && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              {blockError}
            </div>
          )}
          {blockSuccess && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              {blockSuccess}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.secondary }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsBlockModalOpen(false);
                setBlockError('');
                setBlockSuccess('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleBlockUser}
              disabled={blockLoading}
              className="flex-1"
              style={{
                backgroundColor: '#DC2626',
                borderColor: '#DC2626',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                if (!blockLoading) {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                  e.currentTarget.style.borderColor = '#B91C1C';
                }
              }}
              onMouseLeave={(e) => {
                if (!blockLoading) {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                  e.currentTarget.style.borderColor = '#DC2626';
                }
              }}
            >
              {blockLoading ? 'Blocking...' : 'Block User'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Unblock User Modal */}
      <Modal
        isOpen={isUnblockModalOpen}
        onClose={() => {
          setIsUnblockModalOpen(false);
          setBlockError('');
          setBlockSuccess('');
        }}
        title="Unblock User"
        size="md"
      >
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 rounded-lg" style={{ backgroundColor: '#F0FDF4' }}>
            <UserCheck size={24} style={{ color: '#10B981' }} />
            <p className="text-sm" style={{ color: '#065F46' }}>
              Are you sure you want to unblock <strong>{currentRoom ? getDisplayName(currentRoom) : 'this user'}</strong>?
            </p>
          </div>

          <p className="text-sm" style={{ color: colors.textSecondary }}>
            Unblocking this user will:
          </p>
          <ul className="text-sm space-y-2" style={{ color: colors.textSecondary }}>
            <li className="flex items-center gap-2">
              <CheckCheck size={16} style={{ color: '#10B981' }} />
              Allow them to send you messages again
            </li>
            <li className="flex items-center gap-2">
              <CheckCheck size={16} style={{ color: '#10B981' }} />
              Restore this conversation in your chat list
            </li>
            <li className="flex items-center gap-2">
              <CheckCheck size={16} style={{ color: '#10B981' }} />
              Show their listings in your browse view
            </li>
          </ul>

          {blockError && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#FEE2E2', color: '#DC2626' }}>
              {blockError}
            </div>
          )}
          {blockSuccess && (
            <div className="p-3 rounded-lg text-sm" style={{ backgroundColor: '#D1FAE5', color: '#065F46' }}>
              {blockSuccess}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t" style={{ borderColor: colors.secondary }}>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsUnblockModalOpen(false);
                setBlockError('');
                setBlockSuccess('');
              }}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleUnblockUser}
              disabled={blockLoading}
              className="flex-1"
              style={{
                backgroundColor: '#10B981',
                borderColor: '#10B981',
                color: '#FFFFFF'
              }}
              onMouseEnter={(e) => {
                if (!blockLoading) {
                  e.currentTarget.style.backgroundColor = '#059669';
                  e.currentTarget.style.borderColor = '#059669';
                }
              }}
              onMouseLeave={(e) => {
                if (!blockLoading) {
                  e.currentTarget.style.backgroundColor = '#10B981';
                  e.currentTarget.style.borderColor = '#10B981';
                }
              }}
            >
              {blockLoading ? 'Unblocking...' : 'Unblock User'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Messages;