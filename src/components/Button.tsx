import React from "react";
import Link from "next/link";
import { twMerge } from 'tailwind-merge';

interface ButtonProps{
    onClick? : (event: React.MouseEvent<HTMLButtonElement>) => void;
    children : React.ReactNode;
    type?: 'submit' | 'button' | 'reset';
    href?: string; 
    className?: string
}
export default function Button({onClick, children, type='button',href, className} : ButtonProps){
    const buttonStyles = `
    w-48 text-center
    border-1 border-white rounded-xl p-2 
    hover:border-accent-yellow hover:[filter:drop-shadow(1px_3px_1px_rgba(215,215,0,0.5))] hover:scale-110 
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
    <button type={type} onClick={onClick} className={mergedStyles}>{children}</button>
    );
}

