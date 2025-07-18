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
}

const Card: React.FC<CardProps> = ({ imageUrl, title, description, actionText, linkText, buttonLink, onButtonAction, onInfoClick, className }) => {
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
        <div className="mt-auto flex justify-center gap-4">
          {onInfoClick && (
            <Button onClick={onInfoClick}>{linkText}</Button>
          )}
          {onButtonAction && (
            <Button onClick={onButtonAction}>{actionText}</Button>
          )}
          {buttonLink && (
            <Button href={buttonLink}>{linkText}</Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
