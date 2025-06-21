'use client'; // Mark as Client Component

import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Cookies from 'js-cookie';
import Image from 'next/image';

// Define the dictionary type
interface Dictionary {
  header: {
    courses: string;
    jams_workshops: string;
    faq: string;
    about: string;
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
  const pathname = usePathname(); // Initialize pathname
  const [dropdownOpen, setDropdownOpen] = useState(false); // State for dropdown visibility

  const switchLocale = (locale: string) => {
    Cookies.set('NEXT_LOCALE', locale, { expires: 365 }); // Set the cookie for 1 year
    const newPath = `/${locale}${pathname.startsWith(`/${currentLocale}`) ? pathname.substring(`/${currentLocale}`.length) : pathname}`;
    router.push(newPath);
    setDropdownOpen(false); // Close dropdown after selection
  };

  const locales = [
    { code: 'en', name: 'English', flagCode: 'us' }, // Reverted to 'en' for routing, added 'flagCode' for display
    { code: 'ua', name: 'Українська', flagCode: 'ua' },
  ];

  const currentLocaleData = locales.find(loc => loc.code === currentLocale) || locales[0];

  return (
    <header className="w-full bg-primary-black text-text-light py-2 px-8 flex justify-between items-center border-b border-accent-yellow">
      {/* Logo */}
      <div className="flex items-center">
        <Link href={`/${currentLocale}/`}> {/* Link to locale-specific homepage */}
          {/* Assuming cat1.png is still used for the logo, not a flag */}
          <Image
            src="/cat1.png" // Path to your logo in the public folder
            alt={dict.header.improv_club}
            width={50} // Adjust size as needed
            height={50} // Adjust size as needed
            className="cursor-pointer"
          />
        </Link>
        {/* Optional: Add school name next to logo */}
        <span className="ml-3 text-xl font-bold text-accent-yellow hidden sm:block">{dict.header.improv_club}</span>
      </div>

      {/* Navigation */}
      <nav className="hidden md:block">
        <ul className="flex space-x-8">
          <li><Link href={`/${currentLocale}/courses`} className="hover:text-accent-yellow transition-colors duration-200">{dict.header.courses}</Link></li>
          <li><Link href={`/${currentLocale}/jams-workshops`} className="hover:text-accent-yellow transition-colors duration-200">{dict.header.jams_workshops}</Link></li>
          {/* Shows and Merch are hidden for now */}
          {/* <li><Link href={`/${currentLocale}/shows`} className="hover:text-accent-yellow transition-colors duration-200">{dict.header.shows}</Link></li> */}
          <li><Link href={`/${currentLocale}/faq`} className="hover:text-accent-yellow transition-colors duration-200">{dict.header.faq}</Link></li>
          <li><Link href={`/${currentLocale}/about`} className="hover:text-accent-yellow transition-colors duration-200">{dict.header.about}</Link></li>
          {/* <li><Link href={`/${currentLocale}/merch`} className="hover:text-accent-yellow transition-colors duration-200">{dict.header.merch}</Link></li> */}
        </ul>
      </nav>

      {/* Language Switch Dropdown */}
      <div className="relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="flex items-center space-x-2 font-bold text-text-light hover:text-accent-yellow transition-colors duration-200 focus:outline-none"
        >
          <span className={`fi fi-${currentLocaleData.flagCode} fis w-6 h-4 rounded shadow-md`}></span> {/* Use flagCode here */}
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
          <div className="absolute right-4 mt-2 w-fit bg-[#1a1a1a] border border-accent-yellow rounded-md shadow-lg z-10"> {/* Changed bg-primary-black bg-opacity-100 to bg-[#1a1a1a] */}
            {locales.map((locale) => (
              <button
                key={locale.code}
                onClick={() => switchLocale(locale.code)}
                className="flex items-center space-x-2 w-full p-2 text-left text-text-light hover:bg-accent-yellow hover:text-primary-black transition-colors duration-200"
              >
                <span className={`fi fi-${locale.flagCode} fis w-6 h-4 rounded shadow-md`}></span> {/* Re-added flag */}
                <span>{locale.code === 'us' ? 'EN' : locale.code.toUpperCase()}</span> {/* Display EN/UA text */}
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
