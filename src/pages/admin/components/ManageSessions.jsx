import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../../components/ui/Button';
import { sessionsAPI } from '../../../utils/api';
import { toast } from 'react-hot-toast';
import { requireAdmin } from '../../../utils/auth';

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
    imageUrl: '',
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

  const [imageFile, setImageFile] = useState(null);

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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setForm(prev => ({ ...prev, imageUrl: '' }));
    }
  };

  // Handle form submission for CREATE and UPDATE
  const onSubmit = async (e) => {
    e.preventDefault();
  
    try {
      requireAdmin();
  
      // 1. Create an object with all session data from the form
      const sessionData = {
        title: form.title,
        description: form.description,
        startTime: form.startTime,
        endTime: form.endTime,
        type: form.type,
        price: form.price,
        zoomLink: form.zoomLink,
        guideName: form.guideName, // Corrected from payload
        sessionCategory: form.sessionCategory, // Corrected from payload
        capacity: form.capacity,
        active: form.active,
      };
      
      // 2. Create a new FormData object
      const formData = new FormData();
  
      // 3. Append the session data as a JSON Blob named "session"
      formData.append(
        'session',
        new Blob([JSON.stringify(sessionData)], { type: 'application/json' })
      );
  
      // 4. Append the image file if it exists
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      console.log('Submitting session data...');
  
      if (editingId) {
        console.log('Updating session with ID:', editingId);
        // Your update API call might need adjustment if it also expects multipart
        await sessionsAPI.updateSession(editingId, formData); 
        toast.success('Session updated successfully!');
      } else {
        console.log('Creating new session');
        await sessionsAPI.createSession(formData);
        toast.success('Session created successfully!');
      }
  
      // Reset state and close modal
      setForm({ title: '', description: '', startTime: '', endTime: '', type: 'FREE', price: 0, zoomLink: '', guideName: '', sessionCategory: '', capacity: null, active: true, imageUrl: '' });
      setImageFile(null);
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
          startTime: payload.startTime || new Date().toISOString(),
          imageUrl: form.imageUrl, // Add imageUrl to new session for demo mode
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
      startTime: session.startTime ? session.startTime.slice(0, 16) : '',
      endTime: session.endTime ? session.endTime.slice(0, 16) : '',
      type: session.type || 'FREE',
      price: session.price || 0,
      zoomLink: session.zoomLink || '',
      guideName: session.guideName || '',
      sessionCategory: session.sessionCategory || '',
      capacity: session.capacity || null,
      active: session.active || true,
      imageUrl: session.imageUrl || '',
    });
    setIsOpen(true);
  };

  // Handle VIEW REGISTRANTS click
  const openDetails = async (id) => {
    setSelectedId(id);
    setDetailOpen(true);
    toast.info("Registrants feature coming soon!");
    setRegistrants([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Manage Sessions</h2>
          <p className="text-sm text-gray-500">Create, edit, and view registrations for each session.</p>
        </div>
        <Button 
          className="bg-violet-700 hover:bg-violet-800 text-white rounded-xl" 
          onClick={() => setIsOpen(true)}
        >
          Create New Session
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow">
        <table className="w-full text-sm">
          <thead className="bg-violet-50">
            <tr className="text-left text-gray-800">
              <th className="px-4 py-2 text-black">Title</th>
              <th className="px-4 py-2 text-black">Description</th>
              <th className="px-4 py-2 text-black">Start Time</th>
              <th className="px-4 py-2 text-black">End Time</th>
              <th className="px-4 py-2 text-black">Type</th>
              <th className="px-4 py-2 text-black">Price</th>
              <th className="px-4 py-2 text-black">Zoom Link</th>
              <th className="px-4 py-2 text-black">Guide Name</th>
              <th className="px-4 py-2 text-black">Category</th>
              <th className="px-4 py-2 text-black">Capacity</th>
              <th className="px-4 py-2 text-black">Active</th>
              <th className="px-4 py-2 text-black">Image</th>
              <th className="px-4 py-2 text-black text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan="12" className="text-center p-8">Loading sessions...</td></tr>
            ) : (
              sessions.map((s, idx) => (
                <tr key={s.id} className={idx % 2 ? 'bg-white' : 'bg-violet-50/50'}>
                  <td className="px-4 py-2 font-medium text-gray-900">{s.title}</td>
                  <td className="px-4 py-2 text-gray-700 max-w-[200px] truncate">{s.description}</td>
                  <td className="px-4 py-2 text-gray-700">{new Date(s.startTime).toLocaleString()}</td>
                  <td className="px-4 py-2 text-gray-700">{s.endTime ? new Date(s.endTime).toLocaleString() : 'N/A'}</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      s.type === 'FREE' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {s.type}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-gray-700">
                    {s.type === 'PAID' ? `₹${s.price || 0}` : 'Free'}
                  </td>
                  <td className="px-4 py-2 text-violet-700 truncate max-w-[160px]">
                    {s.zoomLink ? (
                      <a href={s.zoomLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        Join Meeting
                      </a>
                    ) : 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-gray-700">{s.guideName || 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-700">{s.sessionCategory || 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-700">{s.capacity || 'N/A'}</td>
                  <td className="px-4 py-2 text-gray-700">{s.active ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2">
                    {s.imageUrl && (
                      <img src={s.imageUrl} alt="Session Thumbnail" className="h-10 w-10 object-cover rounded-lg" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-3 justify-end">
                      <button className="text-violet-700 hover:underline" onClick={() => openDetails(s.id)}>View Registrants</button>
                      <span className="text-gray-300">|</span>
                      <button className="text-violet-700 hover:underline" onClick={() => onEdit(s)}>Edit</button>
                      <button className="text-red-600 hover:underline" onClick={() => onDelete(s.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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
                    Session Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                  {form.imageUrl && (
                    <img src={form.imageUrl} alt="Session Thumbnail" className="mt-2 h-20 w-20 object-cover rounded-lg" />
                  )}
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

      {/* View Registrants Modal */}
      <AnimatePresence>
        {detailOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setDetailOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Session Registrants
                </h3>
                <button
                  onClick={() => setDetailOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {registrants.length > 0 ? (
                  <div className="space-y-2">
                    {registrants.map((registrant, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{registrant.name || registrant.email}</p>
                          <p className="text-sm text-gray-500">{registrant.email}</p>
                        </div>
                        <span className="text-sm text-gray-500">
                          Registered: {new Date(registrant.registrationDate || Date.now()).toLocaleDateString()}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No registrants found for this session.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ManageSessions;