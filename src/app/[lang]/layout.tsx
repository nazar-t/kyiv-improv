import '@/app/globals.css';
import { Roboto_Mono } from 'next/font/google'; // Import Roboto Mono
import Header from '@/components/Header'; // Import the Header component
import UnderConstruction from '@/components/UnderConstruction';
import React from 'react'; // Ensure React is imported
import { getDictionary } from '@/lib/getDictionary'; // Import getDictionary

const roboto_mono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono', // Define as a CSS variable
});

export const metadata = {
  title: 'Improv & Debate Club',
  description: 'Official website for Improv & Debate Club',
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
    <html lang={lang} className={`${roboto_mono.variable}`}>
      <body className="bg-primary-black text-text-light font-mono antialiased flex flex-col min-h-screen">
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
