import '@/app/globals.css';
import { Roboto_Mono } from 'next/font/google'; // Import Roboto Mono
import Header from '@/components/Header'; // Import the Header component
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

export default async function RootLayout({
  children,
  params, // params is a Promise
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>; // Define params type as Promise
}) {
  const { lang } = await params; // Await params here
  console.log('RootLayout - received lang:', lang);
  const dict = await getDictionary(lang);

  return (
    <html lang={lang} className={`${roboto_mono.variable}`}><body className="bg-primary-black text-text-light font-mono antialiased flex flex-col min-h-screen">
        <Header dict={dict} currentLocale={lang} /> {/* Pass dict and currentLocale as props */}
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
