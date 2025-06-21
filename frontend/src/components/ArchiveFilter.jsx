import React, { useState, useEffect } from 'react';

const ArchiveFilter = ({ backendUrl, onFilterChange }) => {
  const [archiveDates, setArchiveDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const response = await fetch(`${backendUrl}/api/articles/archive-dates`);
        if (!response.ok) {
          throw new Error('Failed to fetch archive dates.');
        }
        const data = await response.json();
        setArchiveDates(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDates();
  }, [backendUrl]);

  const handleFilterChange = (event) => {
    const [year, month] = event.target.value.split('-');
    onFilterChange({ year, month });
  };

  if (loading) return <p>Loading filters...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="mb-8 text-center">
      <select 
        onChange={handleFilterChange}
        className="bg-white border border-gray-300 rounded-md py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        defaultValue=""
      >
        <option value="" disabled>Filter by month...</option>
        {archiveDates.map(({ year, month, label }) => (
          <option key={`${year}-${month}`} value={`${year}-${month}`}>{label}</option>
        ))}
      </select>
    </div>
  );
};

export default ArchiveFilter; 