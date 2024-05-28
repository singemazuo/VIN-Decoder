import React from 'react';

const YearDropdown = ({ year, setYear, className }) => {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (v, i) => currentYear - i); 

    return (
        <select value={year} onChange={(e) => setYear(e.target.value)} className={className}>
            <option value="">Select Year</option>
            {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
            ))}
        </select>
    );
};

export default YearDropdown;
