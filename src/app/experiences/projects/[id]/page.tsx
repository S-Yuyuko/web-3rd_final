import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';
import MediaGallery from '@/components/experiences/MediaGallery';
import RainEffect from '@/components/effect/RainEffect';
import DescriptionRenderer from '@/components/experiences/DescriptionRenderer'; // Import the new component

async function fetchProjectData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/projects/${id}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      console.error('Failed to fetch project data:', res.statusText);
      return null;
    }

    return await res.json();
  } catch (error) {
    console.error('Error fetching project data:', error);
    return null;
  }
}

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const projectData = await fetchProjectData(params.id);

  if (!projectData) {
    notFound();
  }

  const { title, startTime, endTime, skills, link, description, media } = projectData;

  return (
    <div className="relative overflow-hidden">
      <RainEffect />

      <div className="p-6 max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-md mt-10 mb-10 relative">
        <div className="flex justify-start mb-4">
          <Link
            href="/experiences"
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            <FaArrowLeft className="mr-2" />
            <span>Back to Experiences</span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4 text-center text-gray-800 dark:text-gray-100">
          {title}
        </h1>

        <div className="flex justify-between items-center mb-6 text-gray-600 dark:text-gray-400 text-sm">
          <p>
            <span className="font-semibold">Start: </span>
            {startTime}
          </p>
          <p>
            <span className="font-semibold">End: </span>
            {endTime}
          </p>
        </div>

        <DescriptionRenderer content={description} />

        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Skills Used</h3>
          <p className="text-gray-700 dark:text-gray-300">{skills}</p>
        </div>

        {link && (
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100">Project Link</h3>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 dark:text-blue-400 hover:underline"
            >
              {link}
            </a>
          </div>
        )}

        {media && media.length > 0 && <MediaGallery mediaUrls={media} />}
      </div>
    </div>
  );
}
