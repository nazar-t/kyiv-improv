import React from 'react';
import { getDictionary } from '@/lib/getDictionary'; // Import dictionary utility

export const metadata = {
  title: 'FAQ - Improv & Debate Club',
  description: 'Frequently Asked Questions about Improv & Debate Club.',
};

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function FAQPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-accent-yellow text-center mb-12">{dict.faq_page.title}</h1>

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
  );
}
