import React from 'react'

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="text-xl font-semibold text-gray-900 mb-3">DivineSpark</div>
            <p className="text-gray-600 text-sm leading-relaxed">Connecting seekers with mentors through calm, live learning experiences.</p>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Browse Sessions</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Become a Host</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Features</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">System Status</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Community</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-gray-900 transition-colors">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="pt-8 mt-8 text-center text-gray-500 text-sm border-t border-gray-200">© 2024 DivineSpark. All rights reserved.</div>
      </div>
    </footer>
  )
}

export default Footer
