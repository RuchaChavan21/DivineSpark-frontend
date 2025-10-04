// Mock Sessions Data
export const mockSessions = [
  {
    id: 1,
    title: "Advanced React Patterns & Performance Optimization",
    description: "Learn advanced React patterns, hooks optimization, and performance techniques used in production applications.",
    host: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e4?w=150",
      title: "Senior React Developer at Meta",
      rating: 4.9,
      sessions: 127
    },
    category: "Web Development",
    date: "2024-01-25",
    time: "14:00",
    duration: 120, // minutes
    price: 89,
    maxAttendees: 50,
    currentAttendees: 43,
    isPaid: true,
    isUpcoming: true,
    zoomLink: "https://zoom.us/j/123456789",
    tags: ["React", "JavaScript", "Performance", "Advanced"],
    level: "Advanced",
    status: "confirmed"
  },
  {
    id: 2,
    title: "Introduction to Machine Learning with Python",
    description: "Get started with machine learning concepts and build your first ML model using Python and scikit-learn.",
    host: {
      name: "Dr. Michael Chen",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      title: "Data Science Lead at OpenAI",
      rating: 4.8,
      sessions: 89
    },
    category: "Data Science",
    date: "2024-01-28",
    time: "18:00",
    duration: 180,
    price: 0,
    maxAttendees: 100,
    currentAttendees: 78,
    isPaid: false,
    isUpcoming: true,
    zoomLink: "https://zoom.us/j/987654321",
    tags: ["Python", "Machine Learning", "Beginner", "Data Science"],
    level: "Beginner",
    status: "confirmed"
  },
  {
    id: 3,
    title: "UI/UX Design Principles for Developers",
    description: "Bridge the gap between design and development. Learn essential design principles to create beautiful, user-friendly interfaces.",
    host: {
      name: "Emily Rodriguez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      title: "Senior UX Designer at Airbnb",
      rating: 4.9,
      sessions: 156
    },
    category: "Design",
    date: "2024-01-30",
    time: "16:00",
    duration: 90,
    price: 65,
    maxAttendees: 75,
    currentAttendees: 62,
    isPaid: true,
    isUpcoming: true,
    zoomLink: "https://zoom.us/j/456789123",
    tags: ["UI/UX", "Design", "Frontend", "Intermediate"],
    level: "Intermediate",
    status: "confirmed"
  },
  {
    id: 4,
    title: "Building Scalable APIs with Node.js and Express",
    description: "Learn to build robust, scalable REST APIs using Node.js, Express, and modern development practices.",
    host: {
      name: "James Wilson",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      title: "Backend Engineer at Stripe",
      rating: 4.7,
      sessions: 203
    },
    category: "Backend Development",
    date: "2024-02-02",
    time: "15:00",
    duration: 150,
    price: 75,
    maxAttendees: 60,
    currentAttendees: 45,
    isPaid: true,
    isUpcoming: true,
    zoomLink: "https://zoom.us/j/789123456",
    tags: ["Node.js", "Express", "API", "Backend"],
    level: "Intermediate",
    status: "confirmed"
  },
  {
    id: 5,
    title: "DevOps Essentials: Docker & Kubernetes",
    description: "Master containerization and orchestration with Docker and Kubernetes for modern application deployment.",
    host: {
      name: "Alex Kumar",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      title: "DevOps Engineer at Google",
      rating: 4.8,
      sessions: 94
    },
    category: "DevOps",
    date: "2024-02-05",
    time: "10:00",
    duration: 200,
    price: 95,
    maxAttendees: 40,
    currentAttendees: 32,
    isPaid: true,
    isUpcoming: true,
    zoomLink: "https://zoom.us/j/321654987",
    tags: ["Docker", "Kubernetes", "DevOps", "Cloud"],
    level: "Advanced",
    status: "confirmed"
  },
  {
    id: 6,
    title: "Career Transition to Tech: A Complete Guide",
    description: "Everything you need to know about transitioning to a tech career, including skills, networking, and job search strategies.",
    host: {
      name: "Lisa Thompson",
      avatar: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150",
      title: "Tech Career Coach",
      rating: 4.9,
      sessions: 312
    },
    category: "Career Development",
    date: "2024-01-22",
    time: "19:00",
    duration: 90,
    price: 0,
    maxAttendees: 200,
    currentAttendees: 156,
    isPaid: false,
    isUpcoming: false,
    zoomLink: "https://zoom.us/j/654987321",
    tags: ["Career", "Tech", "Networking", "Job Search"],
    level: "Beginner",
    status: "completed"
  }
]

// Mock Users Data
export const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    phone: "+1 (555) 123-4567",
    role: "user",
    joinDate: "2023-12-15",
    registeredSessions: [1, 2, 4],
    completedSessions: [6],
    totalSpent: 229,
    status: "active"
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@example.com",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b0e4?w=150",
    phone: "+1 (555) 987-6543",
    role: "user",
    joinDate: "2023-11-20",
    registeredSessions: [2, 3, 5],
    completedSessions: [6],
    totalSpent: 160,
    status: "active"
  },
  {
    id: 3,
    firstName: "Admin",
    lastName: "User",
    email: "admin@divinespark.com",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    phone: "+1 (555) 000-0000",
    role: "admin",
    joinDate: "2023-01-01",
    registeredSessions: [],
    completedSessions: [],
    totalSpent: 0,
    status: "active"
  }
]

// Mock Categories
export const mockCategories = [
  { id: 1, name: "Web Development", icon: "Code", color: "bg-blue-100 text-blue-800" },
  { id: 2, name: "Data Science", icon: "BarChart", color: "bg-green-100 text-green-800" },
  { id: 3, name: "Design", icon: "Palette", color: "bg-purple-100 text-purple-800" },
  { id: 4, name: "Backend Development", icon: "Server", color: "bg-yellow-100 text-yellow-800" },
  { id: 5, name: "DevOps", icon: "Settings", color: "bg-red-100 text-red-800" },
  { id: 6, name: "Career Development", icon: "TrendingUp", color: "bg-indigo-100 text-indigo-800" },
  { id: 7, name: "Mobile Development", icon: "Smartphone", color: "bg-pink-100 text-pink-800" },
  { id: 8, name: "Cybersecurity", icon: "Shield", color: "bg-orange-100 text-orange-800" }
]

// Mock Statistics for Admin Dashboard
export const mockStats = {
  totalSessions: 156,
  totalUsers: 2847,
  totalRevenue: 45230,
  activeUsers: 1876,
  upcomingSessions: 23,
  completedSessions: 133,
  averageRating: 4.8,
  conversionRate: 15.3
}

// Mock Payment Data
export const mockPayments = [
  {
    id: "pay_1",
    userId: 1,
    sessionId: 1,
    amount: 89,
    currency: "USD",
    status: "completed",
    paymentMethod: "card",
    transactionDate: "2024-01-20",
    paymentId: "pi_1234567890"
  },
  {
    id: "pay_2",
    userId: 2,
    sessionId: 3,
    amount: 65,
    currency: "USD", 
    status: "completed",
    paymentMethod: "card",
    transactionDate: "2024-01-18",
    paymentId: "pi_0987654321"
  },
  {
    id: "pay_3",
    userId: 1,
    sessionId: 4,
    amount: 75,
    currency: "USD",
    status: "pending",
    paymentMethod: "card",
    transactionDate: "2024-01-22",
    paymentId: "pi_1122334455"
  }
]

// Helper functions
export const getSessionById = (id) => {
  return mockSessions.find(session => session.id === parseInt(id))
}

export const getUserById = (id) => {
  return mockUsers.find(user => user.id === parseInt(id))
}

export const getSessionsByCategory = (category) => {
  return mockSessions.filter(session => session.category === category)
}

export const getUpcomingSessions = () => {
  return mockSessions.filter(session => session.isUpcoming)
}

export const getCompletedSessions = () => {
  return mockSessions.filter(session => !session.isUpcoming)
}

export const getUserSessions = (userId) => {
  const user = getUserById(userId)
  if (!user) return []
  
  const registeredSessions = mockSessions.filter(session => 
    user.registeredSessions.includes(session.id)
  )
  
  return registeredSessions
}

export const getPaymentsByUserId = (userId) => {
  return mockPayments.filter(payment => payment.userId === parseInt(userId))
}

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

export const formatDate = (input) => {
  // Handle both Date objects and date strings
  let date
  
  if (input instanceof Date) {
    date = input
  } else if (typeof input === 'string') {
    date = new Date(input)
  } else {
    return 'Invalid Date'
  }
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatTime = (input) => {
  // Handle both Date objects and time strings
  let date
  
  if (input instanceof Date) {
    date = input
  } else if (typeof input === 'string') {
    // Legacy support for time strings like "14:30"
    date = new Date(`2024-01-01 ${input}`)
  } else {
    return 'Invalid Time'
  }
  
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
