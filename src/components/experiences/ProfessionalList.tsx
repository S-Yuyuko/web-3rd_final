"use client"

import React, { useState, useEffect } from 'react';
import ProfessionalCard from '@/components/experiences/ProfessionalCard';

interface Professional {
  id: string;
  title: string;
  startTime: string | null;
  endTime: string | null;
  media: string[];
  description: string | null;
  company: string | null;
  skills: string | null;
}

interface ProfessionalListProps {
  professionals: Professional[];
}

const ProfessionalList: React.FC<ProfessionalListProps> = ({ professionals }) => {
  const [sortedProfessionals, setSortedProfessionals] = useState<Professional[]>(professionals);

  useEffect(() => {
    const sorted = [...professionals].sort((a, b) => a.title.localeCompare(b.title));
    setSortedProfessionals(sorted);
  }, [professionals]);

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    let sorted: Professional[];

    if (value === 'title') {
      sorted = [...professionals].sort((a, b) => a.title.localeCompare(b.title));
    } else if (value === 'startTime') {
      sorted = [...professionals].sort((a, b) => {
        if (!a.startTime) return 1;
        if (!b.startTime) return -1;
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      });
    } else {
      sorted = professionals; // Reset to original order if "none" selected
    }

    setSortedProfessionals(sorted);
  };

  return (
    <>
      <div className="mb-4">
        <label htmlFor="sort-select" className="mr-2">Sort by:</label>
        <select
          id="sort-select"
          onChange={handleSortChange}
          className="p-2 border rounded text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600"
        >
          <option value="title">Title</option>
          <option value="startTime">Start Time</option>
        </select>
      </div>

      {sortedProfessionals.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4 rounded-md">
          {sortedProfessionals.map((professional) => (
            <ProfessionalCard key={professional.id} professional={professional} />
          ))}
        </div>
      ) : (
        <p className="mt-4 text-lg text-gray-100">No professionals available.</p>
      )}
    </>
  );
};

export default ProfessionalList;
