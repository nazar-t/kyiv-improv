import React from 'react';

interface SectionWrapperProps {
  children: React.ReactNode;
  className?: string; // To allow adding extra classes from parent
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ children, className }) => {
  return (
    <section className={`bg-primary-black border border-accent-yellow rounded-lg shadow-md ${className || ''}`}>
      {children}
    </section>
  );
};

export default SectionWrapper;
