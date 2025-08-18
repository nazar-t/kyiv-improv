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

const getUkrainianMonthInGenitiveCase = (month: number, dict: Dictionary) => {
  const months = dict.months_genitive;
  return months[month];
};

const formatEventDate = (date: string, dict: Dictionary) => {
  const d = new Date(date);
  const dayOfMonth = d.getDate();
  const month = d.getMonth();
  const dayOfWeek = d.toLocaleDateString(dict.lang === 'ua' ? 'uk-UA' : 'en-US', { weekday: 'short' }).toUpperCase();
  
  if (dict.lang === 'ua') {
    const monthGenitive = getUkrainianMonthInGenitiveCase(month, dict);
    return `${dayOfMonth} ${monthGenitive}, ${dayOfWeek}`;
  }
  
  const monthName = d.toLocaleDateString('en-US', { month: 'long' });
  return `${dayOfMonth} ${monthName}, ${dayOfWeek}`;
};

const formatTime = (time: string, duration: number | null, dict: Dictionary) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const startTime = new Date();
  startTime.setHours(hours, minutes, 0);

  let endTime;
  if (duration) {
    endTime = new Date(startTime.getTime() + duration * 60000);
  }

  const options: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };
  const formattedStartTime = startTime.toLocaleTimeString(dict.lang === 'ua' ? 'uk-UA' : 'en-US', options);
  const formattedEndTime = endTime ? endTime.toLocaleTimeString(dict.lang === 'ua' ? 'uk-UA' : 'en-US', options) : '';

  return formattedEndTime ? `${formattedStartTime}-${formattedEndTime}` : formattedStartTime;
};

export default function HomePageClient({ items, dict }: HomePageClientProps) {
  
  //Modals
  const [registerItem, setRegisterItem] = useState<Course | EventWithCount | null>(null);
  const [infoItem, setInfoItem] = useState<EventWithCount | null>(null);

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
                {items.map(item => {
                  const description = (
                    <>
                      <p><span className="font-bold">{dict.courses_page.when}:</span> {formatEventDate(item.date, dict)}, {formatTime(item.time, item.duration, dict)}</p>
                      <p><span className="font-bold">{dict.courses_page.price}:</span> {item.price} {dict.courses_page.currency}</p>
                    </>
                  );
                  return (
                    // Each slide needs a wrapper div for sizing and spacing
                    <div key={item.id} className="flex-grow-0 flex-shrink-0 w-full sm:w-1/2 lg:w-1/3 p-4">
                      <Card
                        title={item.name}
                        imageUrl={"/logo.png"}
                        description={description}
                        actionText={dict.button.sign_up}
                        linkText={dict.button.learn_more}
                        onButtonAction={() => setRegisterItem(item)}
                        onInfoClick={() => setInfoItem(item)}
                        className="h-full"
                        isSoldOut={item.isSoldOut}
                      />
                    </div>
                  )
                })}
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
              imageUrl="https://placehold.co/600x400/1a1a1a/FFFFFF?text=Beginner+Course"
            />
            <Card
              title={dict.homepage.advanced_improv_title}
              description={dict.homepage.advanced_improv_description}
              linkText={dict.button.learn_more}
              buttonLink={`/${dict.lang}/courses`}
              imageUrl="https://placehold.co/600x400/FFD700/1a1a1a?text=Advanced+Course"
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
          <h2 className="text-3xl font-russo mb-6 text-center">{dict.homepage.contact_us_title}</h2>
          <div className="bg-gray-100 p-6 rounded-lg text-primary-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-russo mb-2">{dict.homepage.location_info_title}</h3>
                <p>{dict.homepage.location}: {dict.homepage.address}</p>
                <p>{dict.homepage.phone}: +380662273790</p>
                <p>{dict.homepage.email}: info@coolcats.com.ua</p>
              </div>
              <div>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2540.537325787222!2d30.52340841573196!3d50.4501!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d4ce50f2e8f8c9%3A0x40c88c5a7c4bceb5!2sMaidan%20Nezalezhnosti!5e0!3m2!1sen!2sua!4v1620931230181!5m2!1sen!2sua" 
                  width="100%" 
                  height="300" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy"
                ></iframe>
              </div>
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
        dict={dict}
      />
    </div>
  );
}
