import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthCard from '../../components/common/AuthCard';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { cn } from '../../utils/cn';
import { ArrowLeft, Mail, Lock } from 'lucide-react';

const LoginPage = () => {
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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Handle successful login here
      console.log('Login successful:', formData);
      
    } catch (error) {
      console.error('Login failed:', error);
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
