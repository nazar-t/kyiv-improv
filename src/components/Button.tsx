import React from "react";
import Link from "next/link";
import { twMerge } from 'tailwind-merge';

interface ButtonProps{
    onClick? : (event: React.MouseEvent<HTMLButtonElement>) => void;
    children : React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    href?: string; 
    className?: string;
    disabled?: boolean;
}
export default function Button({onClick, children, type='button',href, className, disabled} : ButtonProps){
    const buttonStyles = `
    w-48 text-center text-text-light 
    bg-red-600 
    rounded-full p-2 
    hover:[filter:drop-shadow(-2px_2px_3px_rgba(0,0,0,0.5))] hover:scale-110 
    cursor-pointer transition-transform duration-200 
    ${className || ''}`;
    
    //to override default style     
    const mergedStyles = twMerge(buttonStyles, className);

    //To ensure Link buttons have the same styles
    if (href) {
        return (
        <Link href={href} className={mergedStyles}>
            {children}
        </Link>
        );
    }
    
    return (
    <button type={type} onClick={onClick} className={mergedStyles} disabled={disabled}>{children}</button>
    );
}
