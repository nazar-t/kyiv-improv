import React from 'react';
import Image from 'next/image';
import Button from './Button';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  imageUrl?: string;
  title: string;
  description: React.ReactNode;
  linkText?: string;
  actionText?: string;
  buttonLink?: string;
  onButtonAction?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onInfoClick?: () => void; 
  className?: string;
  isSoldOut?: boolean;
  soldOutText?: string;
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, actionText, linkText, buttonLink, onButtonAction, onInfoClick, className, isSoldOut, soldOutText }) => {
  return (
    <div className={twMerge(`bg-gray-200 text-text-dark rounded-lg shadow-lg flex flex-col overflow-hidden`, className)}>
      {imageUrl && (
        <div className="relative w-full h-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className='object-cover'
          />
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/75 flex items-center justify-center z-10">
              <span className="text-red-500 text-4xl font-bold transform -rotate-33">{soldOutText}</span>
            </div>
          )}
        </div>
      )}
      <div className="flex flex-col justify-between p-4 flex-grow">
        <div>
          <h3 className="text-xl font-bold text-red-600 mb-2">{title}</h3>
          <div className="mb-4">{description}</div>
        </div>
        <div className="mt-auto flex justify-center gap-4">
          {onInfoClick && (
            <Button onClick={onInfoClick} className='text-text-light bg-red-600 whitespace-nowrap'>{linkText}</Button>
          )}
          {onButtonAction && (
            <Button onClick={onButtonAction} disabled={isSoldOut} className='text-text-light bg-red-600 disabled:bg-gray-400 whitespace-nowrap'>
              {isSoldOut ? soldOutText : actionText}
            </Button>
          )}
          {buttonLink && (
            <Button href={buttonLink} className='text-text-light bg-red-600 whitespace-nowrap'>{linkText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
