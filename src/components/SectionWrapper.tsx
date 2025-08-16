import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string; 
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className }) => {
  return (
    <section className={`bg-primary-black min-h-[50vh] px-4 sm:px-6 lg:px-8 ${className || ''}`}>
      {children}
    </section>
  );
};  

export default SectionWrapper;
