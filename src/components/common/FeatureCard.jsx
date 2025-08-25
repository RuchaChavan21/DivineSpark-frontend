import React from 'react'
import { cn } from '../../utils/cn'

const FeatureCard = ({ icon: Icon, title, description, className }) => {
  return (
    <div
      className={cn(
        'rounded-xl border border-gray-200/70 bg-white/80 backdrop-blur-sm shadow-sm p-6 transition-transform duration-200',
        'hover:shadow-md hover:scale-[1.01]',
        className
      )}
    >
      <div className="inline-flex items-center justify-center p-3 rounded-xl mb-4" style={{ backgroundColor: '#EDE9FE' }}>
        {Icon ? <Icon className="h-6 w-6" color="#7C3AED" /> : null}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
    </div>
  )
}

export default FeatureCard
