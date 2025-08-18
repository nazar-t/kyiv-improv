'use client'; 
import React, { useState } from 'react';
import { useCallback } from 'react';
import { Course, EventWithCount } from '@/lib/supabaseClient';
import { Dictionary } from '@/lib/getDictionary';
import useEmblaCarousel from 'embla-carousel-react';
import RegistrationModal from '@/components/RegistrationModal';
import SectionWrapper from '@/components/SectionWrapper';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Carousel from '@/components/Carousel';
import InfoModal from '@/components/InfoModal';
import FaqItem from '@/components/FaqItem';

// Define the props that this client component expects
interface HomePageClientProps {
  items: EventWithCount[];
  dict: Dictionary; 
}

export default function HomePageClient({ items, dict }: HomePageClientProps) {
  
  //Modals
  const [registerItem, setRegisterItem] = useState<Course | EventWithCount | null>(null);
  const [infoItem, setInfoItem] = useState<EventWithCount | null>(null);

  //Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const handleNewsletterSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault(); // Prevent the form from causing a page reload
    // TODO: Add API call logic here. For now, we'll just log it to the console to show it's working.
    console.log(`Subscribing email: ${newsletterEmail}`);
    setNewsletterEmail(''); // Clear the input field after submission
    };

  //Carousel
  const [eventsEmblaRef, coursesEmblaApi] = useEmblaCarousel({ 
    align: 'start',
    loop: true,
  });

  const scrollEventsPrev = useCallback(() => {
    if (coursesEmblaApi) coursesEmblaApi.scrollPrev();
  }, [coursesEmblaApi]);

  const scrollEventsNext = useCallback(() => {
    if (coursesEmblaApi) coursesEmblaApi.scrollNext();
  }, [coursesEmblaApi]);

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

// FAQ
const faqData = [
  {
    category: dict.faq.general_questions,
    items: [
      {
        q: dict.faq.what_is_improv_q,
        a: dict.faq.what_is_improv_a,
      },
      {
        q: dict.faq.do_i_need_experience_q,
        a: dict.faq.do_i_need_experience_a,
      },
    ],
  },
  {
    category: dict.faq.registration_payment,
    items: [
      {
        q: dict.faq.how_to_sign_up_q,
        a: dict.faq.how_to_sign_up_a,
      },
      {
        q: dict.faq.payment_methods_q,
        a: dict.faq.payment_methods_a,
      },
    ],
  },
  {
    category: dict.faq.online_in_person,
    items: [
      {
        q: dict.faq.online_in_person_q,
        a: dict.faq.online_in_person_a,
      },
    ],
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
          <h2 className="text-3xl font-russo text-text-light mb-6 text-center">{dict.homepage.upcoming_events}</h2>
          <div className="relative w-full max-w-7xl mx-auto">
            {/* This is the Embla "viewport" which clips the content */}
            <div className="overflow-hidden" ref={eventsEmblaRef}>
              {/* This is the Embla "container" which holds the slides */}
              <div className="flex">
                {items.map(item => (
                  // Each slide needs a wrapper div for sizing and spacing
                  <div key={item.id} className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4">
                    <Card
                      title={item.name}
                      imageUrl={"/logo.png"}
                      description={`${item.date} - Price: ${item.price} UAH`}
                      actionText={dict.button.sign_up}
                      linkText={dict.button.learn_more}
                      onButtonAction={() => setRegisterItem(item)}
                      onInfoClick={() => setInfoItem(item)}
                      className="h-[70vh]" // Keep the tall card style
                      isSoldOut={item.isSoldOut}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Left Arrow */}
            <button onClick={scrollEventsPrev} className="absolute top-1/2 -translate-y-1/2 -left-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">
              <svg className="w-6 h-6 text-primary-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
            </button>
            
            {/* Right Arrow */}
            <button onClick={scrollEventsNext} className="absolute top-1/2 -translate-y-1/2 -right-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10">
              <svg className="w-6 h-6 text-primary-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* 3. COURSES SECTION */}
      <SectionWrapper>
        <div className="container mx-auto py-8 h-full flex flex-col">
          <h2 className="text-3xl font-russo text-text-light mb-6 text-center">{dict.homepage.our_core_courses}</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mx-auto'>
            <Card 
              title={dict.homepage.beginner_improv_title}
              description={dict.homepage.beginner_improv_description}
              linkText={dict.button.learn_more}
              buttonLink={`/${dict.lang}/courses`} 
            />
            <Card
              title={dict.homepage.advanced_improv_title}
              description={dict.homepage.advanced_improv_description}
              linkText={dict.button.learn_more}
              buttonLink={`/${dict.lang}/courses`} 
            />
          </div>
        </div>
      </SectionWrapper>

      {/* 4. FAQ SECTION*/} 
      <SectionWrapper>
        <div className="container mx-auto px-8 py-8">
          <h2 className="text-3xl font-russo text-text-light mb-6 text-center">{dict.faq.title}</h2>
          {faqData.map((item, index) => (
            <section key={index} className="mb-8">
              <h2 className="text-2xl font-russo text-text-light mb-4">{item.category}</h2>
              <div className="space-y-4">
                {item.items.map(i => (
                    <FaqItem key={i.q} question={i.q} answer={
                      i.a}></FaqItem>
                ))}
              </div>
            </section>
          ))}
        </div>
      </SectionWrapper>

      {/* 5. CONTACTS SECTION */}
      <SectionWrapper>
        <div className="container mx-auto py-8">
          <h2 className="text-3xl font-russo text-text-light mb-6 text-center">{dict.homepage.contact_us_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-russo mb-2">{dict.homepage.location_info_title}</h3>
              <p>{dict.homepage.location}: {dict.homepage.address}</p>
              <p>{dict.homepage.phone}: +380662273790</p>
              <p>{dict.homepage.email}: info@coolcats.com.ua</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg text-text-light">
              <h3 className="text-xl font-russo mb-2">{dict.homepage.newsletter_signup_title}</h3>
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

      {/* MODALS (Don't appear until an item is selected) */}
      <RegistrationModal 
        item={registerItem!} 
        onClose={() => setRegisterItem(null)}
        dict={dict} 
        registrationType="event"
      />

      <InfoModal 
        item={infoItem} 
        onClose={() => setInfoItem(null)}
      />
    </div>
  );
}
