# DivineSpark Frontend

A modern, premium React frontend for DivineSpark - a live session booking platform. Built with React, TailwindCSS, and modern web technologies.

## 🚀 Features

- **Modern Design**: Clean, minimalistic UI inspired by Apple and Calendly
- **Responsive**: Fully responsive design that works on all devices
- **Authentication**: Complete OTP-based registration flow
- **Premium UI Components**: Built with shadcn/ui and TailwindCSS
- **Smooth Animations**: Powered by Framer Motion
- **Type-safe**: Built with modern React patterns

## 🛠️ Tech Stack

- **React 18** - Modern React with hooks
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI components
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client for API calls

## 🎨 Design System

### Colors
- **Primary**: Deep Purple (#6D28D9) to Soft Violet (#A78BFA)
- **Background**: Gradient from gray-50 to primary-50
- **Cards**: Glassmorphism with backdrop blur

### Typography
- **Font**: Inter (Google Fonts)
- **Headings**: Bold, gradient text
- **Body**: Clean, readable sans-serif

### Components
- **Buttons**: Rounded corners (2xl), hover effects, gradient backgrounds
- **Cards**: Glass effect with subtle shadows
- **Inputs**: Clean with icons, focus states
- **Navigation**: Fixed glass navbar with responsive mobile menu

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Dialog.jsx
│   │   └── ...
│   └── common/       # Common components
│       └── Navigation.jsx
├── pages/
│   ├── LandingPage.jsx
│   └── auth/
│       ├── LoginPage.jsx
│       └── RegisterPage.jsx
├── data/
│   └── mockData.js   # Mock data for development
├── utils/
│   ├── api.js        # API configuration
│   └── cn.js         # Utility functions
└── App.js            # Main app with routing
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm start
   ```

3. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
```

This creates a `build` folder with optimized production files.

## 📱 Pages & Features

### Landing Page
- Hero section with compelling copy
- Feature showcase with icons
- Statistics section
- How it works explanation
- Call-to-action sections
- Footer with links

### Authentication
- **Login Page**: Email/password with social login options
- **Registration Flow**: 3-step OTP verification
  1. Enter email
  2. Verify OTP code
  3. Complete profile

### Responsive Design
- Mobile-first approach
- Responsive navigation with mobile menu
- Optimized for tablets and desktop
- Touch-friendly interactions

## 🎯 Demo Credentials

For testing the authentication flow:

**Login (Mock)**
- Email: `admin@divinespark.com` or `user@example.com`
- Password: Any password (mock authentication)

**OTP Verification (Mock)**
- Use code: `123456` for successful verification

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to customize the color palette:

```javascript
colors: {
  primary: {
    // Your custom colors
  }
}
```

### Components
All UI components are in `src/components/ui/` and can be customized:

- Modify variants in component files
- Update CSS classes in `src/index.css`
- Add new animations in component files

### Content
- Update copy in page files
- Modify mock data in `src/data/mockData.js`
- Replace placeholder images with your assets

## 🔄 API Integration

The app is ready for API integration:

1. **Update API base URL** in `src/utils/api.js`
2. **Replace mock API calls** with real endpoints
3. **Add authentication context** for user state management
4. **Implement protected routes** for authenticated areas

### API Endpoints Expected
- `POST /auth/login`
- `POST /auth/register` 
- `POST /auth/send-otp`
- `POST /auth/verify-otp`
- `GET /sessions`
- `POST /sessions/:id/book`
- And more...

## 📦 Deployment

### Netlify/Vercel
1. Build the project: `npm run build`
2. Deploy the `build` folder
3. Set up redirects for SPA routing

### Environment Variables
Create a `.env` file for environment-specific settings:

```
REACT_APP_API_URL=https://your-api-url.com/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_...
```

## 🧪 Development

### Mock Data
The app uses mock data for development. See `src/data/mockData.js` for:
- Sample sessions
- User profiles  
- Categories
- Statistics

### API Mocking
`src/utils/api.js` includes a `mockAPI` object with simulated responses for testing.

## 🎉 What's Included

### ✅ Completed Features
- ✅ Modern, responsive landing page
- ✅ Complete authentication flow (Login + OTP Registration)
- ✅ Premium UI component library
- ✅ Smooth animations and transitions
- ✅ Mock data and API structure
- ✅ Routing setup
- ✅ Mobile-responsive design

### 🚧 Ready for Implementation
- User dashboard with session booking
- Admin dashboard for session management
- Payment integration
- User profile management
- Session detail pages
- Real-time notifications

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 💫 Credits

Built with love using:
- [React](https://reactjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

**DivineSpark** - Where learning meets excellence ✨
