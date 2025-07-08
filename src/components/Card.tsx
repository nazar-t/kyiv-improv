import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from './Button';

interface CardProps {
  imageUrl?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  buttonAction?: (event: React.MouseEvent<HTMLButtonElement>) => void; 
  className?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, buttonText, buttonLink, buttonAction, className }) => {
  return (
    <div className={`bg-primary-black border border-accent-yellow p-6 gap-5 items-start rounded-lg shadow-lg flex-none w-full max-w-md`}>
      {imageUrl && (
        <div className="relative flex-none w-30 aspect-square">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
          />
        </div>
      )}
      <div className="flex-grow">
        <h3 className="text-xl font-bold text-accent-yellow mb-2">{title}</h3>
        <p className="text-text-light mb-4">{description}</p>
        {buttonAction && (
          <Button onClick={buttonAction}>{buttonText}</Button>
        )}
        {buttonLink && !buttonAction && (
          <Button href={buttonLink}>{buttonText}</Button>
        )}
      </div>
    </div>
  );
};

export default Card;
