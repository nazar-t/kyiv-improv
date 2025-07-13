import React from 'react';
import { getDictionary } from '@/lib/getDictionary'; // Import dictionary utility

export const metadata = {
  title: 'About Us - Improv & Debate Club',
  description: 'Learn more about the founders and actors of Improv & Debate Club.',
};

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function AboutPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl text-accent-yellow text-center mb-12">{dict.about_page.title}</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-bold  text-text-light mb-6 text-center">{dict.about_page.our_story}</h2>
        <p className="text-text-light text-lg leading-relaxed text-center max-w-3xl mx-auto">
          {dict.about_page.our_story_text}
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl  text-text-light mb-6 text-center">{dict.about_page.meet_founders}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Founder 1 */}
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg text-center">
            {/* Placeholder for image */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <span className="text-text-light">Photo</span>
            </div>
            <h3 className="text-2xl font-bold text-accent-yellow mb-2">{dict.about_page.founder_name_1}</h3>
            <p className="text-text-light mb-4">{dict.about_page.founder_role_1}</p>
            <p className="text-text-light text-sm">
              {dict.about_page.founder_bio_1}
            </p>
          </div>
          {/* Founder 2 */}
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg text-center">
            {/* Placeholder for image */}
            <div className="w-32 h-32 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-4">
              <span className="text-text-light">Photo</span>
            </div>
            <h3 className="text-2xl font-bold text-accent-yellow mb-2">{dict.about_page.founder_name_2}</h3>
            <p className="text-text-light mb-4">{dict.about_page.founder_role_2}</p>
            <p className="text-text-light text-sm">
              {dict.about_page.founder_bio_2}
            </p>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-text-light mb-6 text-center">{dict.about_page.our_actors_coaches}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Actor/Coach 1 */}
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-text-light text-sm">Photo</span>
            </div>
            <h3 className="text-xl font-bold text-accent-yellow mb-1">{dict.about_page.actor_coach_name_1}</h3>
            <p className="text-text-light text-sm">{dict.about_page.actor_coach_role_1}</p>
          </div>
          {/* Actor/Coach 2 */}
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-text-light text-sm">Photo</span>
            </div>
            <h3 className="text-xl font-bold text-accent-yellow mb-1">{dict.about_page.actor_coach_name_2}</h3>
            <p className="text-text-light text-sm">{dict.about_page.actor_coach_role_2}</p>
          </div>
          {/* Actor/Coach 3 */}
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-gray-700 flex items-center justify-center mb-3">
              <span className="text-text-light text-sm">Photo</span>
            </div>
            <h3 className="text-xl font-bold text-accent-yellow mb-1">{dict.about_page.actor_coach_name_3}</h3>
            <p className="text-text-light text-sm">{dict.about_page.actor_coach_role_3}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
