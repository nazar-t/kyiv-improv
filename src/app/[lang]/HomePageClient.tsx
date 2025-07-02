'use client'; 
import React, { useState } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import Card from '@/components/Card';
import RegistrationModal from '@/components/RegistrationModal';
import type { RegistrableItem } from '@/lib/supabaseClient';
import { Dictionary } from '@/lib/getDictionary';

// Define the props that this client component expects
interface HomePageClientProps {
  items: RegistrableItem[];
  dict: Dictionary; 
}

export default function HomePageClient({ items, dict }: HomePageClientProps) {
  // State for the modal remains here
  const [selectedItem, setSelectedItem] = useState<RegistrableItem | null>(null);

    return (
    <div className="container mx-auto">
      {/* 1. HIGHLIGHTS CAROUSEL SECTION */}
      <SectionWrapper>
        <div className="py-8">
          <div className="bg-gray-700 h-64 flex items-center justify-center text-text-light text-xl rounded-lg">
            [Placeholder for Carousel Component]
          </div>
        </div>
      </SectionWrapper>

      {/* 2. EVENT CALENDAR SECTION (shows, jams, workshops) */}
      <SectionWrapper>
        <div className="py-8">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.upcoming_events}</h2>
          {items.length === 0 && <p className="text-text-light text-center">{dict.homepage.no_upcoming_events}</p>}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map(item => (
              <Card
                key={item.id}
                title={item.name}
                description={`${item.date} - Price: ${item.price} UAH`}
                buttonText={dict.homepage.sign_up}
                buttonAction={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* 3. COURSES SECTION */}
      <SectionWrapper>
        <div className="py-8">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.our_core_courses}</h2>
          <div className='flex justify-center max-w-l'>
            <Card 
              title={dict.homepage.beginner_improv_title}
              description={dict.homepage.beginner_improv_description}
              buttonText={dict.homepage.learn_more}
              buttonLink={`/${dict.lang}/courses`} // Assuming lang is in dict
            />
            <Card
              title={dict.homepage.advanced_improv_title}
              description={dict.homepage.advanced_improv_description}
              buttonText={dict.homepage.learn_more}
              buttonLink={`/${dict.lang}/courses`} // Assuming lang is in dict
            />
          </div>
        </div>
      </SectionWrapper>

      {/* 4. FAQ SECTION */}
      <SectionWrapper>
        <div className="py-8">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.faq_page.title}</h2>
          <div className="bg-gray-700 h-48 flex items-center justify-center text-text-light text-xl rounded-lg">
            [Placeholder for FAQ Content]
          </div>
        </div>
      </SectionWrapper>

      {/* 5. CONTACTS SECTION */}
      <SectionWrapper>
        <div className="py-8">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.contact_us_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-bold mb-2">{dict.homepage.location_info_title}</h3>
              <p>{dict.homepage.address}: [Your Address Here]</p>
              <p>{dict.homepage.phone}: [Your Phone Here]</p>
              <p>{dict.homepage.email}: [Your Email Here]</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-bold mb-2">{dict.homepage.newsletter_signup_title}</h3>
              <p>{dict.homepage.newsletter_signup_description}</p>
              <form className="mt-4">
                <input
                  type="email"
                  placeholder={dict.homepage.your_email_placeholder}
                  className="w-full p-2 rounded bg-gray-800 text-text-light border border-gray-600 focus:outline-none focus:border-accent-yellow"
                />
                <button
                  type="submit"
                  className="mt-2 w-full bg-accent-yellow text-primary-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition-colors duration-200"
                >
                  {dict.homepage.subscribe_button}
                </button>
              </form>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* REGISTRATION MODAL (Doesn't appear until an item is selected) */}
      <RegistrationModal 
        item={selectedItem} 
        onClose={() => setSelectedItem(null)}
        dict={dict} 
      />
    </div>
  );
}