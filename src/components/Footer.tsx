import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Dictionary } from '@/lib/getDictionary';
import Button from './Button';

interface FooterProps {
  dict: Dictionary;
}

const Footer: React.FC<FooterProps> = ({ dict }) => {
  return (
    <footer className="bg-black border-t-2 border-yellow-400 text-white py-8 text-base">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-around items-start">
          <div className="w-full md:w-1/5 text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold mb-2">{dict.footer.legal_title}</h3>
            <ul>
              <li><Link href="/tos" className="transition-transform duration-200 hover:text-yellow-400 hover:scale-110 inline-block">{dict.footer.tos}</Link></li>
              <li><Link href="/refund-policy" className="transition-transform duration-200 hover:text-yellow-400 hover:scale-110 inline-block">{dict.footer.refund_policy}</Link></li>
              <li><Link href="/privacy-policy" className="transition-transform duration-200 hover:text-yellow-400 hover:scale-110 inline-block">{dict.footer.privacy_policy}</Link></li>
            </ul>
          </div>
          <div className="w-full md:w-1/5 text-center md:text-left mb-4 md:mb-0">
            <h3 className="font-bold mb-2">{dict.footer.social_media_title}</h3>
            <ul>
              <li><a href="#" className="transition-transform duration-200 hover:text-yellow-400 hover:scale-110 inline-block">Instagram</a></li>
              <li><a href="#" className="transition-transform duration-200 hover:text-yellow-400 hover:scale-110 inline-block">Youtube</a></li>
              <li><a href="#" className="transition-transform duration-200 hover:text-yellow-400 hover:scale-110 inline-block">Telegram</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/5 text-center md:text-left">
            <h3 className="font-bold mb-2">{dict.footer.newsletter_cta}</h3>
            <form className="flex items-center justify-center md:justify-start relative">
              <input
                type="email"
                placeholder={dict.footer.newsletter_placeholder}
                className="bg-gray-800 text-white px-3 py-2 rounded-full focus:outline-none w-full"
              />
              <Button type="submit" className="absolute right-1 top-1/2 -translate-y-1/2 bg-yellow-400 text-black rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                </svg>
              </Button>
            </form>
          </div>
        </div>
        <div className="text-center mt-8 relative">
          <p>&copy; {new Date().getFullYear()} {dict.footer.copyright}</p>
          <div className="absolute bottom-0 right-0">
            <Image src="/logo.png" alt="Cat Logo" width={40} height={40} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;