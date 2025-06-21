import React from 'react';
import Link from 'next/link'; // Assuming Link is used for buttons that navigate

interface CardProps {
  imageUrl?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  // Optional: Add a prop for a custom class name if needed for specific instances
  className?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, buttonText, buttonLink, className }) => {
  return (
    <div className={`bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg flex flex-col ${className || ''}`}>
      {imageUrl && ( // Conditionally render image if provided
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}

      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-accent-yellow mb-2">{title}</h3>
        <p className="text-text-light mb-4">{description}</p>
      </div>

      <Link href={buttonLink} className="inline-block bg-accent-yellow text-primary-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200 mt-auto text-center">
        {buttonText}
      </Link>
    </div>
  );
};

export default Card;
