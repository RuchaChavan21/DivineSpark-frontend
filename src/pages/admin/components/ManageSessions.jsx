import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { sessionsAPI } from '../../../utils/api';
import { toast } from 'react-hot-toast';
import { requireAdmin } from '../../../utils/auth';
import { Calendar, Clock, Users, MapPin, DollarSign, Edit, Trash2, Eye, ExternalLink, Download } from 'lucide-react';
const ManageSessions = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    type: 'FREE',
    price: 0,
    zoomLink: '',
    guideName: '',
    sessionCategory: '',
    capacity: null,
    active: true,
  });

  // Check authentication on component mount
  useEffect(() => {
    try {
      requireAdmin();
    } catch (error) {
      toast.error(error.message);
      window.location.href = '/login';
      return;
    }
  }, []);

  const [registrants, setRegistrants] = useState([]);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Fetch all sessions from the backend
  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      requireAdmin();
      const response = await sessionsAPI.getAllSessionsAdmin();
      setSessions(response.data);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.message === 'Authentication required' || error.message === 'Admin privileges required') {
        toast.error(error.message);
        window.location.href = '/login';
      } else if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        toast.error('Sessions endpoint not found. Please check if the backend server is running.');
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Using demo data. Please check if the backend is running on http://localhost:8081');
        setSessions([
          {
            id: 1,
            title: "Demo Session 1",
            description: "This is a demo session for testing purposes",
            startTime: new Date(Date.now() + 86400000).toISOString(),
            endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
            type: "FREE",
            price: 0,
            zoomLink: "https://zoom.us/j/demo123",
            active: true
          },
          {
            id: 2,
            title: "Demo Session 2",
            description: "Another demo session",
            startTime: new Date(Date.now() + 172800000).toISOString(),
            endTime: new Date(Date.now() + 172800000 + 3600000).toISOString(),
            type: "PAID",
            price: 500,
            zoomLink: "https://zoom.us/j/demo456",
            active: true
          }
        ]);
      } else {
        toast.error('Could not load sessions.');
        setSessions([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  // Handle form submission for CREATE and UPDATE
  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form };

    try {
      requireAdmin();
      
      console.log('Submitting session data:', payload);
      
      if (editingId) {
        console.log('Updating session with ID:', editingId);
        await sessionsAPI.updateSession(editingId, payload);
        toast.success('Session updated successfully!');
      } else {
        console.log('Creating new session');
        await sessionsAPI.createSession(payload);
        toast.success('Session created successfully!');
      }
      
      setForm({ title: '', description: '', startTime: '', endTime: '', type: 'FREE', price: 0, zoomLink: '', guideName: '', sessionCategory: '', capacity: null, active: true });
      setEditingId(null);
      setIsOpen(false);
      fetchSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText
      });
      
      if (error.response?.status === 401) {
        toast.error('Authentication failed. Please log in again.');
        window.location.href = '/login';
      } else if (error.response?.status === 403) {
        toast.error('Access denied. Admin privileges required.');
      } else if (error.response?.status === 404) {
        toast.error('Session endpoint not found. Please check if the backend server is running.');
      } else if (error.response?.status >= 500) {
        toast.error('Server error. Please try again later.');
      } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
        toast.error('Cannot connect to server. Saving locally for demo purposes. Please check if the backend is running on http://localhost:8081');
        
        const newSession = {
          id: Date.now(),
          ...payload,
          startTime: payload.startTime || new Date().toISOString()
        };
        
        if (editingId) {
          setSessions(prev => prev.map(s => s.id === editingId ? { ...s, ...payload } : s));
          toast.success('Session updated locally (demo mode)');
        } else {
          setSessions(prev => [newSession, ...prev]);
          toast.success('Session created locally (demo mode)');
        }
        
        setForm({ title: '', description: '', startTime: '', endTime: '', type: 'FREE', price: 0, zoomLink: '', guideName: '', sessionCategory: '', capacity: null, active: true });
        setEditingId(null);
        setIsOpen(false);
      } else {
        toast.error(`Failed to save session: ${error.message}`);
      }
    }
  };

  // Handle DELETE
  const onDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        requireAdmin();
        await sessionsAPI.deleteSession(id);
        toast.success('Session deleted.');
        fetchSessions();
      } catch (error) {
        console.error('Failed to delete session:', error);
        if (error.message === 'Authentication required' || error.message === 'Admin privileges required') {
          toast.error(error.message);
          window.location.href = '/login';
        } else if (error.code === 'ECONNREFUSED' || error.message.includes('Network Error')) {
          setSessions(prev => prev.filter(s => s.id !== id));
          toast.success('Session deleted locally (demo mode)');
        } else {
          toast.error('Failed to delete session.');
        }
      }
    }
  };

  // Handle EDIT click
  const onEdit = (session) => {
    setEditingId(session.id);
    setForm({
      title: session.title || '',
      description: session.description || '',
      startTime: session.startTime || '',
      endTime: session.endTime || '',
      type: session.type || 'FREE',
      price: session.price || 0,
      zoomLink: session.zoomLink || '',
      guideName: session.guideName || '',
      sessionCategory: session.sessionCategory || '',
      capacity: session.capacity || null,
      active: session.active || true,
    });
    setIsOpen(true);
  };

  // Handle VIEW REGISTRANTS click
  const openDetails = async (id) => {
    setSelectedId(id);
    setDetailOpen(true);
    setRegistrants([]);
  };

  // Handle Excel download for registrants
  const downloadRegistrantsExcel = () => {
    const session = sessions.find(s => s.id === selectedId);
    if (!session) return;

    // Create CSV content
    const csvContent = [
      ['Name', 'Email', 'Registration Date'],
      ...registrants.map(r => [
        r.name || 'N/A',
        r.email || 'N/A',
        new Date(r.registrationDate || Date.now()).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${session.title.replace(/[^a-zA-Z0-9]/g, '_')}_registrants.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    toast.success('Registrants list downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Manage Sessions</h2>
          <p className="text-gray-600 mt-2">Create, edit, and view your meditation sessions.</p>
        </div>
        <Button 
          className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl px-6 py-3" 
          onClick={() => setIsOpen(true)}
        >
          Create New Session
        </Button>
      </div>

      {/* Sessions Grid */}
{isLoading ? (
  <div className="flex items-center justify-center py-12">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600 mx-auto mb-4"></div>
      <p className="text-gray-500">Loading sessions...</p>
    </div>
  </div>
) : sessions.length === 0 ? (
  <div className="text-center py-12">
    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
    <p className="text-gray-500">No sessions found. Create your first session!</p>
  </div>
) : (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {sessions.map((session, index) => {
      const getTypeBadgeColor = (type) => {
        switch (type) {
          case 'FREE':
            return 'bg-green-100 text-green-800 border-green-200';
          case 'PAID':
            return 'bg-blue-100 text-blue-800 border-blue-200';
          case 'ONLINE':
            return 'bg-purple-100 text-purple-800 border-purple-200';
          case 'OFFLINE':
            return 'bg-orange-100 text-orange-800 border-orange-200';
          default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
        }
      };

      const truncateText = (text, maxLength = 100) => {
        if (!text) return '';
        return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
      };

      return (
        <motion.div
          key={session.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className="bg-white rounded-2xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
          onClick={() => openDetails(session.id)}
        >
          <div className="p-6">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                {session.title}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeBadgeColor(session.type)}`}>
                {session.type}
              </span>
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {truncateText(session.description)}
            </p>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-2" />
                {new Date(session.startTime).toLocaleDateString()}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              {session.capacity && (
                <div className="flex items-center text-sm text-gray-500">
                  <Users className="h-4 w-4 mr-2" />
                  {session.capacity} seats
                </div>
              )}
              {session.type === 'PAID' && (
                <div className="flex items-center text-sm text-gray-500">
                  <DollarSign className="h-4 w-4 mr-2" />
                  ₹{session.price || 0}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(session);
                  }}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Session"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(session.id);
                  }}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Session"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Eye className="h-3 w-3 mr-1" />
                Click to view details
              </div>
            </div>
          </div>
        </motion.div>
      );
    })}
  </div>
)}

      {/* Create/Edit Session Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingId ? 'Edit Session' : 'Create New Session'}
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={onSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    rows={3}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guide Name
                  </label>
                  <input
                    type="text"
                    value={form.guideName}
                    onChange={(e) => setForm(prev => ({ ...prev, guideName: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Category
                  </label>
                  <input
                    type="text"
                    value={form.sessionCategory}
                    onChange={(e) => setForm(prev => ({ ...prev, sessionCategory: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Capacity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form.capacity || ''}
                    onChange={(e) => setForm(prev => ({ ...prev, capacity: parseInt(e.target.value) || null }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date & Time *
                  </label>
                  <input
                    type="datetime-local"
                    value={form.startTime}
                    onChange={(e) => setForm(prev => ({ ...prev, startTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={form.endTime}
                    onChange={(e) => setForm(prev => ({ ...prev, endTime: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Session Type *
                  </label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    required
                  >
                    {/* SessionType enum: FREE, PAID, ONLINE, OFFLINE */}
                    <option value="FREE">Free</option>
                    <option value="PAID">Paid</option>
                    <option value="ONLINE">Online</option>
                    <option value="OFFLINE">Offline</option>
                  </select>
                </div>

                {form.type === 'PAID' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                      required={form.type === 'PAID'}
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Zoom Link
                  </label>
                  <input
                    type="url"
                    value={form.zoomLink}
                    onChange={(e) => setForm(prev => ({ ...prev, zoomLink: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    placeholder="https://zoom.us/j/..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Active
                  </label>
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm(prev => ({ ...prev, active: e.target.checked }))}
                    className="h-4 w-4 text-violet-600 focus:ring-violet-500 border-gray-300 rounded"
                  />
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <Button
                    type="submit"
                    className="bg-violet-700 hover:bg-violet-800 text-white px-6 py-2 rounded-lg"
                  >
                    {editingId ? 'Update Session' : 'Create Session'}
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Session Details Modal */}
      <AnimatePresence>
        {detailOpen && selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const session = sessions.find(s => s.id === selectedId);
                if (!session) return null;
                
                const getTypeBadgeColor = (type) => {
                  switch (type) {
                    case 'FREE': return 'bg-green-100 text-green-800 border-green-200';
                    case 'PAID': return 'bg-blue-100 text-blue-800 border-blue-200';
                    case 'ONLINE': return 'bg-purple-100 text-purple-800 border-purple-200';
                    case 'OFFLINE': return 'bg-orange-100 text-orange-800 border-orange-200';
                    default: return 'bg-gray-100 text-gray-800 border-gray-200';
                  }
                };

                return (
                  <>
                    {/* Header */}
                    <div className="bg-gray-800 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-white">{session.title}</h3>
                          <p className="text-gray-300 mt-1">{session.sessionCategory || 'Session Details'}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => {
                              setDetailOpen(false);
                              onDelete(session.id);
                            }}
                            className="text-white hover:text-red-300 p-2 hover:bg-red-600/20 rounded-lg transition-colors"
                            title="Delete Session"
                          >
                            <Trash2 className="h-5 w-5 text-white" />
                          </button>
                          <button
                            onClick={() => setDetailOpen(false)}
                            className="text-white hover:text-gray-300 p-2 hover:bg-gray-700 rounded-lg transition-colors"
                          >
                            <span className="text-white text-xl font-bold">✕</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(80vh-120px)]">
                      <div className="space-y-4">
                        {/* Session Information */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Session Information</h4>
                          <div className="space-y-3">
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getTypeBadgeColor(session.type)}`}>
                                {session.type}
                              </span>
                              {!session.active && (
                                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                  Inactive
                                </span>
                              )}
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4">
                              <p className="text-gray-700">{session.description}</p>
                            </div>
                            {session.guideName && (
                              <div className="flex items-center text-gray-600">
                                <Users className="h-5 w-5 mr-2" />
                                <span>Guide: {session.guideName}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Schedule & Pricing */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Schedule & Pricing</h4>
                          <div className="space-y-3">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-5 w-5 mr-2" />
                              <span>Start: {new Date(session.startTime).toLocaleString()}</span>
                            </div>
                            {session.endTime && (
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-5 w-5 mr-2" />
                                <span>End: {new Date(session.endTime).toLocaleString()}</span>
                              </div>
                            )}
                            {session.capacity && (
                              <div className="flex items-center text-gray-600">
                                <Users className="h-5 w-5 mr-2" />
                                <span>Capacity: {session.capacity} participants</span>
                              </div>
                            )}
                            {session.type === 'PAID' && (
                              <div className="flex items-center text-gray-600">
                                <DollarSign className="h-5 w-5 mr-2" />
                                <span>Price: ₹{session.price || 0}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Meeting Link */}
                        {session.zoomLink && (
                          <div>
                            <h4 className="text-lg font-semibold text-gray-900 mb-3">Meeting Link</h4>
                            <a
                              href={session.zoomLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Join Meeting
                            </a>
                          </div>
                        )}

                        {/* Registrants */}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-3">Registrants</h4>
                          <div className="bg-gray-50 rounded-lg p-4">
                            {registrants.length > 0 ? (
                              <div className="space-y-2">
                                {registrants.map((registrant, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                                    <div>
                                      <p className="font-medium text-gray-900">{registrant.name || registrant.email}</p>
                                      <p className="text-sm text-gray-500">{registrant.email}</p>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {new Date(registrant.registrationDate || Date.now()).toLocaleDateString()}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-gray-500 text-center py-4">No registrants yet</p>
                            )}
                          </div>
                          
                          {/* Download Excel Button */}
                          <div className="mt-4 text-center">
                            <button
                              onClick={downloadRegistrantsExcel}
                              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Excel Sheet
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageSessions;