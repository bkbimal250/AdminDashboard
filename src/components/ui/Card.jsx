import React from 'react';

const Card = ({ children, className = '', hover = false, ...props }) => {
  const baseClasses = "bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden transition-all duration-200";
  const hoverClasses = hover ? "hover:shadow-medium hover:scale-[1.02] hover:border-primary-200" : "";
  
  return (
    <div className={`${baseClasses} ${hoverClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '', divider = false, ...props }) => {
  const baseClasses = "px-6 py-4";
  const dividerClasses = divider ? "border-b border-gray-100" : "";
  
  return (
    <div className={`${baseClasses} ${dividerClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardContent = ({ children, className = '', padding = true, ...props }) => {
  const baseClasses = padding ? "px-6 py-4" : "";
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardTitle = ({ children, className = '', ...props }) => {
  const baseClasses = "text-lg font-semibold text-gray-900";
  
  return (
    <h3 className={`${baseClasses} ${className}`} {...props}>
      {children}
    </h3>
  );
};

const CardBody = ({ children, className = '', padding = true, ...props }) => {
  const baseClasses = padding ? "px-6 py-4" : "";
  
  return (
    <div className={`${baseClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

const CardFooter = ({ children, className = '', divider = false, ...props }) => {
  const baseClasses = "px-6 py-4";
  const dividerClasses = divider ? "border-t border-gray-100" : "";
  
  return (
    <div className={`${baseClasses} ${dividerClasses} ${className}`} {...props}>
      {children}
    </div>
  );
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export { Card, CardContent, CardHeader, CardTitle };
export default Card;
