import { getDictionary } from '@/lib/getDictionary';
import CoursesPageClient from './CoursesPageClient';
import { supabaseServer } from '@/lib/supabaseServerClient';

interface CoursesPageProps {
  params: {
    lang: string;
  };
}

const CoursesPage = async ({ params: { lang } }: CoursesPageProps) => {
  const dictionary = await getDictionary(lang);

  const { data: courses, error } = await supabaseServer
    .from('Courses')
    .select('*')
    .in('type', ['beginner', 'advanced']);

  if (error) {
    console.error('Error fetching courses:', error);
    return <div>Error loading courses. Please try again later.</div>;
  }

  return (
    <CoursesPageClient
      courses={courses || []}
      dict={dictionary}
    />
  );
};

export default CoursesPage;

