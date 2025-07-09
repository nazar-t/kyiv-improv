'use client'; // Mark as Client Component
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';
import Button from './Button';

// Define the dictionary type
interface Dictionary {
  header: {
    courses: string;
    jams_workshops: string;
    faq: string;
    about: string;
    home: string;
    shows: string;
    merch: string;
    improv_club: string;
  };
}

interface HeaderProps {
  dict: Dictionary;
  currentLocale: string;
}

export default function Header({ dict, currentLocale }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navLinks = [
    { href: `/${currentLocale}/`, text: dict.header.home },
    { href: `/${currentLocale}/courses`, text: dict.header.courses },
    { href: `/${currentLocale}/jams-workshops`, text: dict.header.jams_workshops },
    { href: `/${currentLocale}/faq`, text: dict.header.faq },
    { href: `/${currentLocale}/about`, text: dict.header.about },
  ];
  
  const switchLocale = (locale: string) => {
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 }); // Set the cookie for 1 year
    const newPath = `/${locale}${pathname.startsWith(`/${currentLocale}`) ? pathname.substring(`/${currentLocale}`.length) : pathname}`;
    router.push(newPath);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const locales = [
    { code: 'en', name: 'English', flagCode: 'us' },
    { code: 'ua', name: 'Українська', flagCode: 'ua' },
  ];

  const currentLocaleData = locales.find(loc => loc.code === currentLocale) || locales[0];

  return (
    <header className="w-full bg-primary-black text-text-light py-2 px-8 flex justify-between items-center border-b border-accent-yellow">
      {/* Logo */}
      <div className="flex items-center">
        <div className="relative h-12 w-12 md:h-16 md:w-16">
          <Image src="/logo.png" alt="Logo" fill sizes="(max-width: 767px) 48px, 64px" style={{ objectFit: 'contain' }}/>
        </div>
        <span className="ml-3 text-xl font-bold text-accent-yellow hidden sm:block">{dict.header.improv_club}</span>
      </div>
      {/* Navigation */}
      <nav className="hidden md:block">
        <ul className="flex gap-x-3">   
          {navLinks.map((link) => (
            <li key={link.href} className='block transition-transform duration-200 hover:scale-110'><Button href={link.href} className={"border-0"} >{link.text}</Button></li>
          ))}
        </ul>
      </nav>

      <div className="relative w-fit">
         <button onClick={() => setDropdownOpen(!dropdownOpen)}className="flex w-full items-center justify-between p-2 space-x-4 font-bold text-text-light hover:text-accent-yellow transition-colors duration-200 focus:outline-none">
          <div className="flex items-center">
            <span className={`fi fi-${currentLocaleData.flagCode} fis w-6 h-4 rounded shadow-md`}></span>
          </div>
          
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : 'rotate-0'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-full bg-[#1a1a1a] border border-accent-yellow rounded-md shadow-lg z-10">
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => switchLocale(locale.code)}
                className="flex items-center space-x-2 w-full p-2 text-left text-text-light hover:bg-accent-yellow hover:text-primary-black transition-colors duration-200"
              >
                <span className={`fi fi-${locale.flagCode} fis w-6 h-4 rounded shadow-md`}></span>
                <span>{locale.code === 'us' ? 'EN' : locale.code.toUpperCase()}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mobile Menu Button (TODO: Implement mobile menu) */}
      <div className="md:hidden">
        <button className="text-text-light focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}