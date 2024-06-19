import React from 'react';

const YearDropdown = ({ year, setYear, className }) => {
    const currentYear = new Date().getFullYear();

    // Create an array of the last 50 years, starting from the current year
    const years = Array.from({ length: 50 }, (v, i) => currentYear - i); 

    return (
        // Render a dropdown (select) element
        <select 
            value={year} 
            onChange={(e) => setYear(e.target.value)} 
            className={className}
        >
            {/* Default option prompting the user to select a year */}
            <option value="">Select Year</option>
            
            {/* Map through the array of years and create an option element for each */}
            {years.map((yr) => (
                <option key={yr} value={yr}>{yr}</option>
            ))}
        </select>
    );
};

export default YearDropdown;
