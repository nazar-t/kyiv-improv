import { getDictionary } from '@/lib/getDictionary';
import CoursesPageClient from './CoursesPageClient';

interface CoursesPageProps {
  params: {
    lang: string;
  };
}

const CoursesPage = async ({ params: { lang } }: CoursesPageProps) => {
  const dictionary = await getDictionary(lang);

  return (
    <CoursesPageClient
      dict={dictionary}
    />
  );
};

export default CoursesPage;

