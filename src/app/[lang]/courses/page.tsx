import { getDictionary } from '@/lib/getDictionary';
import CoursesPageClient from './CoursesPageClient';

interface CoursesPageProps {
params: Promise<{
    lang: string;
  }>;
}

const CoursesPage = async ({params}: CoursesPageProps) => {
  //const dictionary = await Promise.all(getDictionary(params.lang));
  const { lang } = await params;
  const [dict] = await Promise.all([
    getDictionary(lang)
  ]);
  return (
    <CoursesPageClient
      dict={dict}
    />
  );
};

export default CoursesPage;

