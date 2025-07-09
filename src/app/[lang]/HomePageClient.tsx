'use client'; 
import React, { useState } from 'react';
import SectionWrapper from '@/components/SectionWrapper';
import Card from '@/components/Card';
import RegistrationModal from '@/components/RegistrationModal';
import type { RegistrableItem } from '@/lib/supabaseClient';
import { Dictionary } from '@/lib/getDictionary';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';


// Define the props that this client component expects
interface HomePageClientProps {
  items: RegistrableItem[];
  dict: Dictionary; 
}



export default function HomePageClient({ items, dict }: HomePageClientProps) {
  const [selectedItem, setSelectedItem] = useState<RegistrableItem | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const handleNewsletterSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent the form from causing a page reload
    // TODO: Add your API call logic here
    // For now, we'll just log it to the console to show it's working.
    console.log(`Subscribing email: ${newsletterEmail}`);
    // You could add logic here to show a "Thank you" message.
    setNewsletterEmail(''); // Clear the input field after submission
  };
    const carouselSlides = [
    {
      src: 'https://placehold.co/1600x900/1a1a1a/FFD700?text=Upcoming+Show',
      alt: 'Upcoming show banner',
      title: 'The Grand Improvisation',
      description: 'Join us for a night of spontaneous comedy and theater. This Friday at 8 PM.',
    },
    {
      src: 'https://placehold.co/1600x900/1a1a1a/FFFFFF?text=Beginner+Course',
      alt: 'Beginner improv course',
      title: 'Beginner Improv Course',
      description: 'New 6-week course starting next month. No experience necessary!',
    },
    {
      src: 'https://placehold.co/1600x900/FFD700/1a1a1a?text=Improv+Jam',
      alt: 'Improv jam session',
      title: 'Weekly Improv Jam',
      description: 'Drop in and play! Every Wednesday. All levels welcome.',
    },
  ];

    return (
    <div className="flex flex-col gap-y-8">
      {/* 1. HIGHLIGHTS CAROUSEL SECTION */}
      <SectionWrapper>
        <Carousel slides={carouselSlides} options={{ loop: true }} />
      </SectionWrapper>

      {/* 2. EVENT CALENDAR SECTION (shows, jams, workshops) */}
      <SectionWrapper>
        <div className="container mx-auto py-8 h-full flex flex-col">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.upcoming_events}</h2>
          <div className='flex-grow flex items-center'>
            {items.length === 0 && <p className="text-text-light text-center">{dict.homepage.no_upcoming_events}</p>}
            <div className="w-full flex overflow-x-auto gap-10 py-4 px-4">
              {items.map(item => (
                <Card
                  key={item.id}
                  className="flex-shrink-0 w-80 sm:w-96 h-[70vh]"
                  title={item.name}
                  imageUrl={"/logo.png"}
                  description={`${item.date} - Price: ${item.price} UAH`}
                  buttonText={dict.homepage.sign_up}
                  buttonAction={() => setSelectedItem(item)}
                />
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* 3. COURSES SECTION */}
      <SectionWrapper>
        <div className="container mx-auto py-8 h-full flex flex-col">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.our_core_courses}</h2>
          <div className='grid grid-cols-2 items-center max-w-l'>
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
        <div className="container mx-auto px-8 py-8">
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-text-light mb-4">{dict.faq_page.general_questions}</h2>
            <div className="space-y-4">
              <div className="bg-primary-black border border-accent-yellow p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.faq_page.what_is_improv_q}</h3>
                <p className="text-text-light">{dict.faq_page.what_is_improv_a}</p>
              </div>
              <div className="bg-primary-black border border-accent-yellow p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.faq_page.do_i_need_experience_q}</h3>
                <p className="text-text-light">{dict.faq_page.do_i_need_experience_a}</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-text-light mb-4">{dict.faq_page.registration_payment}</h2>
            <div className="space-y-4">
              <div className="bg-primary-black border border-accent-yellow p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.faq_page.how_to_sign_up_q}</h3>
                <p className="text-text-light">{dict.faq_page.how_to_sign_up_a}</p>
              </div>
              <div className="bg-primary-black border border-accent-yellow p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.faq_page.payment_methods_q}</h3>
                <p className="text-text-light">{dict.faq_page.payment_methods_a}</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-text-light mb-4">{dict.faq_page.online_in_person}</h2>
            <div className="space-y-4">
              <div className="bg-primary-black border border-accent-yellow p-4 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.faq_page.online_in_person_q}</h3>
                <p className="text-text-light">{dict.faq_page.online_in_person_a}</p>
              </div>
            </div>
          </section>
        </div>
      </SectionWrapper>

      {/* 5. CONTACTS SECTION */}
      <SectionWrapper>
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.homepage.contact_us_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-bold mb-2">{dict.homepage.location_info_title}</h3>
              <p>{dict.homepage.location}: {dict.homepage.address}</p>
              <p>{dict.homepage.phone}: +380662273790</p>
              <p>{dict.homepage.email}: info@coolcats.com.ua</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-bold mb-2">{dict.homepage.newsletter_signup_title}</h3>
              <p>{dict.homepage.newsletter_signup_description}</p>
              <form className="mt-4">
                <input
                  type="email"
                  placeholder={dict.homepage.your_email_placeholder}
                  value={newsletterEmail} // Bind the input's value to state
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full p-2 rounded bg-gray-800 text-text-light border border-gray-600 focus:outline-none focus:border-accent-yellow"
                />
                <Button onClick={handleNewsletterSubmit} type="submit">
                  {dict.homepage.subscribe_button}
                </Button>
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