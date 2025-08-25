import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles, 
  User, 
  Phone, 
  Eye, 
  EyeOff, 
  Lock 
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Label } from '../../components/ui/Label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/Card'

const RegisterPage = () => {
  const [currentStep, setCurrentStep] = useState(1) // 1: Email, 2: OTP, 3: Full Registration
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [otpSent, setOtpSent] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  
  // Form data
  const [formData, setFormData] = useState({
    email: '',
    otp: ['', '', '', '', '', ''],
    firstName: '',
    lastName: '',
    phone: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })

  // OTP input refs
  const otpInputs = useRef([])

  // Countdown effect for resend
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [resendCooldown])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return // Prevent multiple characters
    
    const newOtp = [...formData.otp]
    newOtp[index] = value
    setFormData(prev => ({ ...prev, otp: newOtp }))
    
    // Auto-focus next input
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !formData.otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus()
    }
  }

  const validateEmail = () => {
    const newErrors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateOtp = () => {
    const otpString = formData.otp.join('')
    const newErrors = {}
    if (otpString.length !== 6) {
      newErrors.otp = 'Please enter the complete 6-digit code'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateRegistration = () => {
    const newErrors = {}
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\+?[\d\s-()]{10,}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number'
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }
    
    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'Please accept the terms and conditions'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    if (!validateEmail()) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      setOtpSent(true)
      setCurrentStep(2)
      setResendCooldown(60)
    } catch (error) {
      console.error('Error sending OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpSubmit = async (e) => {
    e.preventDefault()
    if (!validateOtp()) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call
      setCurrentStep(3)
    } catch (error) {
      console.error('Error verifying OTP:', error)
      setErrors({ otp: 'Invalid verification code. Please try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault()
    if (!validateRegistration()) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
      console.log('Registration successful:', formData)
      // Handle successful registration
    } catch (error) {
      console.error('Registration error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return
    
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setResendCooldown(60)
    } catch (error) {
      console.error('Error resending OTP:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return "Let's Get Started"
      case 2: return "Verify Your Email"
      case 3: return "Complete Your Profile"
      default: return ""
    }
  }

  const getStepDescription = () => {
    switch (currentStep) {
      case 1: return "Enter your email address to begin your DivineSpark journey"
      case 2: return `We've sent a 6-digit code to ${formData.email}. Please enter it below.`
      case 3: return "Just a few more details to complete your registration"
      default: return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-primary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          {currentStep > 1 ? (
            <Button 
              variant="ghost" 
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          ) : (
            <Link to="/">
              <Button variant="ghost">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          )}
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 ${
                    step <= currentStep
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    step
                  )}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-0.5 mx-2 transition-all duration-200 ${
                      step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="backdrop-blur-xl border-white/30">
              <CardHeader className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-full mb-4 mx-auto"
                >
                  <Sparkles className="h-8 w-8 text-primary-600" />
                </motion.div>
                
                <CardTitle className="text-2xl font-bold gradient-text">
                  {getStepTitle()}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {getStepDescription()}
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                {/* Step 1: Email */}
                {currentStep === 1 && (
                  <form onSubmit={handleEmailSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.email && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.email}
                        </motion.p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        </motion.div>
                      ) : null}
                      {isLoading ? 'Sending Code...' : 'Send Verification Code'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                  <form onSubmit={handleOtpSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <Label>Enter Verification Code</Label>
                      <div className="flex justify-center space-x-3">
                        {formData.otp.map((digit, index) => (
                          <input
                            key={index}
                            ref={(el) => (otpInputs.current[index] = el)}
                            type="text"
                            maxLength="1"
                            value={digit}
                            onChange={(e) => handleOtpChange(index, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(e, index)}
                            className={`w-12 h-12 text-center text-lg font-semibold input-field ${
                              errors.otp ? 'border-red-500' : ''
                            }`}
                          />
                        ))}
                      </div>
                      {errors.otp && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600 text-center"
                        >
                          {errors.otp}
                        </motion.p>
                      )}
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-3">
                        Didn't receive the code?
                      </p>
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={handleResendOtp}
                        disabled={resendCooldown > 0 || isLoading}
                        className="text-primary-600"
                      >
                        {resendCooldown > 0 
                          ? `Resend in ${resendCooldown}s` 
                          : 'Resend Code'
                        }
                      </Button>
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        </motion.div>
                      ) : null}
                      {isLoading ? 'Verifying...' : 'Verify Code'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                )}

                {/* Step 3: Full Registration */}
                {currentStep === 3 && (
                  <form onSubmit={handleRegistrationSubmit} className="space-y-6">
                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                          <Input
                            id="firstName"
                            name="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                          />
                        </div>
                        {errors.firstName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600"
                          >
                            {errors.firstName}
                          </motion.p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          placeholder="Doe"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          className={errors.lastName ? 'border-red-500' : ''}
                        />
                        {errors.lastName && (
                          <motion.p
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-red-600"
                          >
                            {errors.lastName}
                          </motion.p>
                        )}
                      </div>
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          placeholder="+1 (555) 123-4567"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.phone && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.phone}
                        </motion.p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      </div>
                      {errors.password && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.password}
                        </motion.p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className={`pl-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                        />
                      </div>
                      {errors.confirmPassword && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.confirmPassword}
                        </motion.p>
                      )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="space-y-2">
                      <label className="flex items-start space-x-3">
                        <input
                          type="checkbox"
                          name="acceptTerms"
                          checked={formData.acceptTerms}
                          onChange={handleInputChange}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500 mt-1"
                        />
                        <span className="text-sm text-gray-600 leading-relaxed">
                          I agree to the{' '}
                          <a href="#" className="text-primary-600 hover:text-primary-700">
                            Terms of Service
                          </a>
                          {' '}and{' '}
                          <a href="#" className="text-primary-600 hover:text-primary-700">
                            Privacy Policy
                          </a>
                        </span>
                      </label>
                      {errors.acceptTerms && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-sm text-red-600"
                        >
                          {errors.acceptTerms}
                        </motion.p>
                      )}
                    </div>

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        </motion.div>
                      ) : null}
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </Button>
                  </form>
                )}

                {/* Login Link */}
                <div className="text-center mt-6">
                  <p className="text-gray-600">
                    Already have an account?{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium transition-colors">
                      Sign in here
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default RegisterPage
