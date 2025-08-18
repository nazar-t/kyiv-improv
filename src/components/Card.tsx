import React from 'react';
import Image from 'next/image';
import Button from './Button';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  imageUrl?: string;
  title: string;
  description: string;
  linkText?: string;
  actionText?: string;
  buttonLink?: string;
  onButtonAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onInfoClick?: () => void; 
  className?: string;
  isSoldOut?: boolean;
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, actionText, linkText, buttonLink, onButtonAction, onInfoClick, className, isSoldOut }) => {
  return (
    <div className={twMerge(`bg-gray-200 text-text-dark p-4 rounded-lg shadow-lg flex flex-col overflow-hidden relative`, className)}>
      {isSoldOut && (
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-10">
          <span className="text-white text-4xl font-bold transform -rotate-12">SOLD OUT</span>
        </div>
      )}
      {imageUrl && (
        <div className="relative w-full flex-grow flex-shrink-0">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
          />
        </div>
      )}
      <div className="flex flex-col justify-between p-4">
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-2">{title}</h3>
          <p className=" mb-4">{description}</p>
        </div>
        <div className="mt-auto flex justify-center gap-4">
          {onInfoClick && (
            <Button onClick={onInfoClick} className='text-text-light bg-red-600'>{linkText}</Button>
          )}
          {onButtonAction && (
            <Button onClick={onButtonAction} disabled={isSoldOut} className='text-text-light bg-red-600 disabled:bg-gray-400'>
              {isSoldOut ? 'Sold Out' : actionText}
            </Button>
          )}
          {buttonLink && (
            <Button href={buttonLink} className='text-text-light bg-red-600'>{linkText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;