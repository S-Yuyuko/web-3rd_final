import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { uploadSlide, getSlideMedia, deleteSlideMedia, getHomeWords, addHomeWord, updateHomeWord } from '../utils/api';
import { useNotification } from '../contexts/NotificationContext';

type HomeWord = {
  id: string;
  title: string;
  description: string;
};

type HomeContextType = {
  previewUrl: string | null;
  fileName: string | null; // Add fileName here
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleUpload: () => Promise<void>;
  handleCancel: () => void;
  slideMedia: { name: string; path: string }[]; // Renamed from slidePictures to slideMedia
  homeWord: HomeWord;
  setHomeWord: (word: HomeWord) => void;
  handleSaveHomeWord: () => Promise<void>;
  handleDeleteMedia: (name: string) => Promise<void>; // Renamed from handleDeletePicture to handleDeleteMedia
};

const HomeContext = createContext<HomeContextType | undefined>(undefined);

export const useHomeContext = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHomeContext must be used within a HomeProvider');
  }
  return context;
};

export const HomeProvider = ({ children }: { children: React.ReactNode }) => {
  const { showNotification } = useNotification();
  const hasFetched = useRef(false);

  const [homeWord, setHomeWord] = useState<HomeWord>({ id: '', title: '', description: '' });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null); // Add fileName state
  const [slideMedia, setSlideMedia] = useState<{ name: string; path: string }[]>([]); // Updated state variable

  const fetchHomeWords = useCallback(async () => {
    try {
      const words = await getHomeWords();
      const wordsArray = Array.isArray(words) ? words : [words];

      if (wordsArray.length > 0) {
        setHomeWord(wordsArray[0]);
      } else {
        console.error('Words array is empty or has invalid structure.');
      }
    } catch (error) {
      showNotification('Failed to fetch home words.', 'error');
    }
  }, [showNotification]);

  const handleSaveHomeWord = useCallback(async () => {
    const { title, description } = homeWord;
    if (!title || !description) {
      showNotification('Please enter both title and description.', 'error');
      return;
    }

    try {
      if (!homeWord.id) {
        const newWord = { ...homeWord, id: uuidv4() };
        await addHomeWord(newWord);
        showNotification('Home word added successfully!', 'success');
        setHomeWord(newWord);
      } else {
        await updateHomeWord(homeWord.id, { title, description });
        showNotification('Home word updated successfully!', 'success');
      }
      await fetchHomeWords();
    } catch (error) {
      showNotification('Failed to save home word.', 'error');
    }
  }, [homeWord, fetchHomeWords, showNotification]);

  const fetchSlideMedia = useCallback(async () => { // Updated function name
    try {
      const media = await getSlideMedia(); // Assuming API function is renamed
      setSlideMedia(media); // Updated state variable
    } catch (error) {
      showNotification('Failed to fetch media.', 'error');
    }
  }, [showNotification]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const filePreviewUrl = URL.createObjectURL(file);
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
      setPreviewUrl(filePreviewUrl);
      setFileName(file.name); // Set fileName
    }
  }, [previewUrl]);

  const handleCancel = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setFileName(null); // Reset fileName on cancel
  }, [previewUrl]);

  const handleUpload = useCallback(async () => {
    if (!previewUrl || !fileName) {
      showNotification('Please select a file.', 'error');
      return;
    }

    try {
      const blob = await fetch(previewUrl).then((res) => res.blob());
      const uniqueFileName = `${Date.now()}.${fileName.split('.').pop()}`;

      const file = new File([blob], uniqueFileName, { type: blob.type });
      const formData = new FormData();
      formData.append('file', file);

      await uploadSlide(formData);
      showNotification('Upload successful!', 'success');
      handleCancel();
      await fetchSlideMedia(); // Updated function call
    } catch (error) {
      showNotification('Failed to upload file.', 'error');
    }
  }, [previewUrl, fileName, fetchSlideMedia, showNotification, handleCancel]);

  const handleDeleteMedia = useCallback(async (name: string) => { // Updated function name
    try {
      await deleteSlideMedia(name); // Assuming API function is renamed
      showNotification('Media deleted successfully.', 'success');
      await fetchSlideMedia(); // Updated function call
    } catch (error) {
      showNotification('Failed to delete media.', 'error');
    }
  }, [fetchSlideMedia, showNotification]);

  useEffect(() => {
    const storedIdentity = localStorage.getItem('identity');
    if (storedIdentity === 'admin' && !hasFetched.current) {
      fetchSlideMedia(); // Updated function call
      fetchHomeWords();
      hasFetched.current = true;
    }
  }, [fetchSlideMedia, fetchHomeWords]);

  return (
    <HomeContext.Provider
      value={{
        homeWord,
        setHomeWord,
        handleSaveHomeWord,
        previewUrl,
        fileName, // Provide fileName to context consumers
        handleFileChange,
        handleUpload,
        handleCancel,
        slideMedia, // Updated variable
        handleDeleteMedia, // Updated function
      }}
    >
      {children}
    </HomeContext.Provider>
  );
};
