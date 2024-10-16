import ProjectList from '@/components/experiences/ProjectList';
import ProfessionalList from '@/components/experiences/ProfessionalList';
import ExperienceWord from '@/components/experiences/ExperienceWord';
import SnowEffect from '@/components/effect/SnowEffect';

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

async function fetchAllData() {
  try {
    const [projectsRes, professionalsRes, experienceWordRes] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/summaries`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/professionals/summaries`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experiencewords`, { next: { revalidate: 60 } }),
    ]);

    // Check if any of the responses are not okay
    if (!projectsRes.ok || !professionalsRes.ok || !experienceWordRes.ok) {
      throw new Error('Failed to fetch data');
    }

    const [projectsData, professionalsData, experienceWordData] = await Promise.all([
      projectsRes.json(),
      professionalsRes.json(),
      experienceWordRes.json(),
    ]);

    return {
      projects: projectsData,
      professionals: professionalsData,
      experienceWord: experienceWordData.words,
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return {
      projects: [],
      professionals: [],
      experienceWord: { title: 'Default Title', description: 'Default Description' },
    };
  }
}

export default async function ExperiencesPage() {
  const { projects, professionals, experienceWord } = await fetchAllData();

  return (
    <div className="relative p-6 bg-white dark:bg-black min-h-screen overflow-hidden">
      {/* Snow effect */}
      <SnowEffect />

      {/* Main Content */}
      <section className="relative flex flex-col items-center justify-center h-screen">
        <ExperienceWord title={experienceWord.title} description={experienceWord.description} />
      </section>
      
      <section className="relative z-10">
        <h1 className="text-3xl font-bold mb-6 text-black dark:text-white">Experiences</h1>

        <h2 className="text-2xl font-semibold mb-4 text-black dark:text-white">Projects</h2>
        <ProjectList projects={projects} />

        <h2 className="text-2xl font-semibold mt-8 mb-4 text-black dark:text-white">Professionals</h2>
        <ProfessionalList professionals={professionals} />
      </section>
    </div>
  );
}
