import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthCard from '../../components/common/AuthCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { authAPI } from '../../utils/api';
import { jwtDecode } from 'jwt-decode';


const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    const isAdmin = formData.email.trim().toLowerCase() === 'admin@divinespark.com';
    if (!isAdmin) {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({}); // Clear previous errors

    try {
      // 1. Call the login endpoint from your api service
      const response = await authAPI.login(formData);

      // 2. On success, get the token from the response
      const { token } = response.data;

      // 3. Decode the token to get user details and roles
      // Note: The claim name for roles ('roles' here) must match what your backend JWT utility uses.
      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles || [];

      // 4. Determine user role (e.g., check if 'ROLE_ADMIN' is present)
      const userRole = roles.includes('ROLE_ADMIN') ? 'admin' : 'user';

      // 5. Store the token and user role in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', userRole);

      // If the user is an admin, also set the admin token if your app uses it
      if (userRole === 'admin') {
        localStorage.setItem('adminToken', 'true');
      }

      // 6. Navigate to the appropriate dashboard based on role
      if (userRole === 'admin') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/sessions', { replace: true });
      }

    } catch (error) {
      console.error('Login failed:', error);
      // 7. Handle errors from the API
      if (error.response && error.response.status === 401) {
        // If it's a 401, it's invalid credentials
        setErrors({ password: 'Invalid email or password. Please try again.' });
      } else {
        // For other errors (e.g., network error, server down)
        setErrors({ password: 'An unexpected error occurred. Please try again later.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <AuthCard>
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-8 animate-slide-up">
        <h1 className="text-3xl font-semibold text-gray-900 mb-2">Welcome Back to DivineSpark</h1>
        <p className="text-gray-600">Enter your details to continue your journey.</p>
        <div className="mt-3 text-xs text-gray-500">
          <div>Admin: admin@divinespark.com (any password)</div>
          <div>User: user@divinespark.com / user123</div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <div className="relative">
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange}
              className={cn(
                "pl-10 rounded-lg",
                errors.email && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm animate-slide-up">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange}
              className={cn(
                "pl-10 rounded-lg",
                errors.password && "border-red-300 focus:border-red-500 focus:ring-red-500/20"
              )}
              required
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm animate-slide-up">{errors.password}</p>
          )}
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          variant="secondary"
          className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Logging in...</span>
            </div>
          ) : (
            'Login'
          )}
        </Button>
      </form>

      {/* Register Link */}
      <div className="mt-6 text-center animate-slide-up">
        <p className="text-gray-600 text-sm">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 hover:underline"
          >
            Register
          </Link>
        </p>
      </div>
    </AuthCard>
  );
};

export default LoginPage;
