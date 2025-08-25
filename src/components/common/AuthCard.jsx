import React from 'react';
import { cn } from '../../utils/cn';

const AuthCard = ({ children, className, ...props }) => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F5F3FF' }}>
      <div
        className={cn(
          // Card container: ultra minimal, rounded-xl, soft border/shadow
          "w-full max-w-md rounded-xl p-8 bg-white border border-gray-200 shadow-sm",
          // Subtle entrance animation only
          "animate-fade-in",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
