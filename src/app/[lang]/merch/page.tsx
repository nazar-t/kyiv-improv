import React from 'react';
import { getDictionary } from '@/lib/getDictionary'; // Import dictionary utility

export const metadata = {
  title: 'Merch - Improv & Debate Club',
  description: 'Official merchandise for Improv & Debate Club.',
};

interface PageProps {
  params: Promise<{
    lang: string;
  }>;
}

export default async function MerchPage({ params }: PageProps) {
  const { lang } = await params;
  const dict = await getDictionary(lang);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-accent-yellow text-center mb-12">{dict.merch_page.title}</h1>

      <section className="text-center">
        <p className="text-text-light text-lg mb-4">
          {dict.merch_page.check_back_soon}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Placeholder for merch items */}
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-text-light mb-4">
              {dict.merch_page.merch_item_1_title}
            </div>
            <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.merch_page.merch_item_1_title}</h3>
            <p className="text-text-light">{dict.merch_page.merch_item_1_description}</p>
          </div>
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-text-light mb-4">
              {dict.merch_page.merch_item_2_title}
            </div>
            <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.merch_page.merch_item_2_title}</h3>
            <p className="text-text-light">{dict.merch_page.merch_item_2_description}</p>
          </div>
          <div className="bg-primary-black border border-accent-yellow p-6 rounded-lg shadow-lg">
            <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-text-light mb-4">
              {dict.merch_page.merch_item_3_title}
            </div>
            <h3 className="text-xl font-bold text-accent-yellow mb-2">{dict.merch_page.merch_item_3_title}</h3>
            <p className="text-text-light">{dict.merch_page.merch_item_3_description}</p>
          </div>
        </div>
      </section>
    </div>
  );
}
