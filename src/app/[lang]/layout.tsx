import '@/app/globals.css';
import { Roboto_Mono, Russo_One } from 'next/font/google'; // Import Roboto Mono
import Header from '@/components/Header'; // Import the Header component
import UnderConstruction from '@/components/UnderConstruction';
import React from 'react'; // Ensure React is imported
import { getDictionary } from '@/lib/getDictionary'; // Import getDictionary

const roboto_mono = Roboto_Mono({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-roboto-mono', 
});

const russo_one = Russo_One({
  subsets: ['latin', 'cyrillic'],
  weight: '400',
  display: 'swap', 
  variable: '--font-russo-one', 
});

export const metadata = {
  title: 'Kyiv Improv Theater',
  description: 'Improv theater & school in Kyiv',
};

// Add generateStaticParams to define supported locales for static generation
export async function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'ua' }];
}

export default async function RootLayout({children, params,}: {children: React.ReactNode; params: Promise<{ lang: string }>;}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';

  return (
    <html lang={lang} className={`${roboto_mono.variable} ${russo_one.variable}`}>
      <body className="bg-primary-black text-text-light antialiased flex flex-col min-h-screen">
        {isMaintenanceMode ? 
          <UnderConstruction /> : (
          <>
            <Header dict={dict} currentLocale={lang} />
            <main className="flex-grow">
              {children}
            </main>
          </>
          )}
      </body> 
    </html>
  );
}
