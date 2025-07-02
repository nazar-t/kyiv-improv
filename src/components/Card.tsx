import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface CardProps {
  imageUrl?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  buttonAction?: () => void; 
  className?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, buttonText, buttonLink, buttonAction, className }) => {
  return (
    <div className={`bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg flex flex-col ${className || ''}`}>
      {imageUrl && (
        <Image
          src={imageUrl}
          alt={title}
          width={500} // You might need to adjust these based on your design
          height={300} // You might need to adjust these based on your design
          className="w-full h-48 object-cover rounded-t-lg mb-4"
        />
      )}

      <div className="flex-grow">
        <h3 className="text-2xl font-bold text-accent-yellow mb-2">{title}</h3>
        <p className="text-text-light mb-4">{description}</p>
      </div>

      {buttonAction && (
        <button onClick={buttonAction}>
          {buttonText}
        </button>
      )}
    
      {buttonLink && !buttonAction && (
        <Link href={buttonLink}>
          {buttonText}
        </Link>
      )}
    </div>
  );
};

export default Card;
