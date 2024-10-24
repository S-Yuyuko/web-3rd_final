import { useState, useRef } from 'react';
import { FaTimes, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { HomeProvider, useHomeContext } from '@/contexts/HomeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import Notification from '@/components/Notification';

const HomeSectionContent = ({ activeSubSection }: { activeSubSection: string }) => {
  const {
    previewUrl,
    fileName,
    handleFileChange,
    handleUpload,
    handleCancel,
    slideMedia,
    handleDeleteMedia,
    homeWord,
    setHomeWord,
    handleSaveHomeWord,
  } = useHomeContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null); // Reference for video element

  const openModal = (mediaPath: string, type: string) => {
    setSelectedMedia(mediaPath);
    setMediaType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setMediaType(null);
    setIsModalOpen(false);
  };

  const isVideo = (fileName: string | null) => {
    if (!fileName) return false;
    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.ogg'];
    return videoExtensions.some(ext => fileName.toLowerCase().endsWith(ext));
  };

  // Play the video programmatically when it's selected
  const playVideo = () => {
    if (videoRef.current) {
      videoRef.current.play(); // Ensure video starts playing immediately
    }
  };

  const renderSubContent = () => {
    switch (activeSubSection) {
      case 'homeWords':
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">Home Words</h2>
            <div className="mt-4">
              <label className="block mb-2 text-gray-800 dark:text-gray-100">Title:</label>
              <input
                type="text"
                value={homeWord.title ?? ''}
                onChange={(e) => setHomeWord({ ...homeWord, title: e.target.value })}
                className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the title"
              />

              <label className="block mb-2 text-gray-800 dark:text-gray-100">Description:</label>
              <textarea
                value={homeWord.description ?? ''}
                onChange={(e) => setHomeWord({ ...homeWord, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-md mb-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the description"
              />

              <button onClick={handleSaveHomeWord} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Save Home Words
              </button>
            </div>
          </>
        );

      case 'slideMedia':
        return (
          <>
            <h2 className="text-2xl font-bold mb-2">Slider Media</h2>
            <div className="mt-4">
              <label className="block mb-2 text-gray-800 dark:text-gray-100">Upload Media:</label>
              <input
                type="file"
                onChange={(e) => {
                  handleFileChange(e);
                }}
                value=""
                className="mb-4 w-full px-4 py-2 border rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {previewUrl && (
                <div className="relative mb-4">
                  {isVideo(fileName) ? (
                    <video
                      controls
                      width={256}
                      preload="metadata" // Preload video metadata to load faster
                      poster="/default-poster.jpg" // Add a placeholder poster image
                      className="border rounded-md"
                    >
                      <source src={previewUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <Image
                      src={previewUrl}
                      alt="Preview"
                      width={256}
                      height={256}
                      className="border rounded-md"
                    />
                  )}
                  <button
                    onClick={handleCancel}
                    className="absolute top-2 left-2 text-white bg-red-500 hover:bg-red-600 rounded-full p-1 focus:outline-none"
                  >
                    <FaTimes className="w-4 h-4" />
                  </button>
                </div>
              )}
              <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Upload Media
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-100">Uploaded Media</h3>
              <table className="w-full border-collapse text-center">
                <thead>
                  <tr>
                    <th className="border px-4 py-2">Media Preview</th>
                    <th className="border px-4 py-2">Media Name</th>
                    <th className="border px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slideMedia.map((media) => (
                    <tr key={media.name} className="align-middle">
                      <td className="border px-4 py-2 align-middle flex justify-center items-center">
                        {media.path.endsWith('.mp4') ? (
                          <video
                            ref={videoRef}
                            width={100}
                            preload="metadata" // Preload video metadata to load faster
                            className="border rounded-md cursor-pointer"
                            onClick={() => openModal(media.path, 'video')}
                          >
                            <source src={media.path} type="video/mp4" />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <Image
                            src={media.path}
                            alt={media.name}
                            width={100}
                            height={100}
                            className="border rounded-md cursor-pointer"
                            onClick={() => openModal(media.path, 'image')}
                          />
                        )}
                      </td>
                      <td className="border px-4 py-2 align-middle">{media.name}</td>
                      <td className="border px-4 py-2 align-middle">
                        <button
                          onClick={() => handleDeleteMedia(media.name)}
                          className="items-center justify-center text-red-500 hover:text-red-700 focus:outline-none"
                        >
                          <FaTrashAlt className="inline-block w-5 h-5 mr-1" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        );

      default:
        return (
          <>
            <h1 className="text-3xl font-bold mb-4">Home</h1>
            <p>Select a subcategory from the catalog.</p>
          </>
        );
    }
  };

  return (
    <div>
      {renderSubContent()}

      {isModalOpen && selectedMedia && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 z-30 flex justify-center items-center"
          onClick={closeModal}
        >
          {mediaType === 'video' ? (
            <div className="flex justify-center items-center w-full h-full">
              <video
                ref={videoRef}
                controls
                preload="auto"
                className="rounded-md"
                style={{
                  maxWidth: '100%',
                  maxHeight: '90%', // Ensure it doesn't exceed 90% of the viewport height
                  margin: 'auto', // Center the video horizontally
                }}
                onLoadedMetadata={playVideo} // Play the video as soon as metadata is loaded
              >
                <source src={selectedMedia} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            <Image
              src={selectedMedia}
              alt="Full size"
              fill
              style={{ objectFit: 'contain' }} // Updated to use the style prop
              className="rounded-md"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default function HomeSection({ activeSubSection }: { activeSubSection: string }) {
  return (
    <NotificationProvider>
      <HomeProvider>
        <HomeSectionContent activeSubSection={activeSubSection} />
        <Notification />
      </HomeProvider>
    </NotificationProvider>
  );
}
