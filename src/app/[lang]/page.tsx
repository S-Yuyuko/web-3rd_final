import SlideShow from '@/components/home/SlideShow';
import HomeWords from '@/components/home/HomeWords';
import BubbleEffect from '@/components/effect/BubbleEffect';
import { translateText, translateJsonObject } from '@/utils/translate'; // Import the translation utilities

// Revalidate every 60 seconds for ISR
export const revalidate = 60;

// Define the type for the slide picture
interface Media {
  name: string;
  path: string;
}

interface WordsData {
  words?: {
    title: string;
    description: string;
  };
}

interface SlidesData {
  media: Media[];
}

async function fetchData(lang: string) {
  try {
    const [wordsResponse, slidesResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/homewords?lang=${lang}`, { next: { revalidate: 60 } }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/slides`, { next: { revalidate: 60 } }),
    ]);

    const [wordsData, slidesData]: [WordsData, SlidesData] = await Promise.all([
      wordsResponse.json(),
      slidesResponse.json(),
    ]);

    let { title, description } = wordsData.words || { title: 'Default Title', description: 'Default description' };

    const media = slidesData.media.map((media: Media) => ({
      name: media.name,
      path: media.path,
    }));

    // Optionally, translate the title and description using your translation utilities
    if (lang !== 'en') { // Assuming 'en' is your default language
      const translatedData = await translateJsonObject({ title, description }, lang);
      title = translatedData.title;
      description = translatedData.description;
    }

    return { title, description, media };
  } catch (error) {
    console.error('Failed to fetch title, description, or slide media:', error);
    return { title: 'Default Title', description: 'Default description', media: [] };
  }
}

export default async function HomePage({ params }: { params: { lang: string } }) {
  const { title, description, media } = await fetchData(params.lang);

  return (
    <main className="relative min-h-screen flex flex-col bg-white dark:bg-black text-gray-900 dark:text-gray-100 overflow-hidden">
      <BubbleEffect />
      <SlideShow pictures={media} />

      <section className="relative flex flex-col items-center justify-center h-screen">
        <HomeWords title={title} description={description} />
      </section>
    </main>
  );
}
