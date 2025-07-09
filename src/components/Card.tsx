import React from 'react';
import Image from 'next/image';
import Button from './Button';
import { twMerge } from 'tailwind-merge';

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
<div className={twMerge(`bg-primary-black border border-accent-yellow p-4 rounded-lg shadow-lg flex flex-col overflow-hidden`, className)}>
      {imageUrl && (
        <div className="relative w-ful h-2/5 flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
          />
        </div>
      )}
      <div className="flex-grow flex flex-col justify-between p-4">
        <div>
          <h3 className="text-xl font-bold text-accent-yellow mb-2">{title}</h3>
          <p className="text-text-light mb-4">{description}</p>
        </div>
        <div className='mt-auto'>
          {buttonAction && (
            <Button onClick={buttonAction}>{buttonText}</Button>
          )}
          {buttonLink && !buttonAction && (
            <Button href={buttonLink}>{buttonText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
