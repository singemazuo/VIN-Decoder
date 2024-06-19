import React, { useState } from 'react';
import styles from './YearFilter.module.css';

const YearFilter = ({ minYear, setMinYear, maxYear, setMaxYear }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Toggle the expanded state of the filter section
    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // Handle change for minimum year input
    const handleMinYearChange = (e) => {
        const value = e.target.value;
        // Allow only numeric values or empty string
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMinYear(value);
        }
    };

    // Handle change for maximum year input
    const handleMaxYearChange = (e) => {
        const value = e.target.value;
        // Allow only numeric values or empty string
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMaxYear(value);
        }
    };

    return (
        <div className={styles.yearFilter}>
            {/* Header section to toggle the expanded state */}
            <div className={styles.header} onClick={handleToggle}>
                <span>Year</span>
                {/* Display '-' if expanded, '+' if collapsed */}
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {/* Conditional rendering of the input fields based on isExpanded state */}
            {isExpanded && (
                <div className={styles.content}>
                    {/* Input for minimum year */}
                    <input
                        type="text"
                        placeholder="Min"
                        value={minYear}
                        onChange={handleMinYearChange}
                        className={styles.input}
                    />
                    {/* Input for maximum year */}
                    <input
                        type="text"
                        placeholder="Max"
                        value={maxYear}
                        onChange={handleMaxYearChange}
                        className={styles.input}
                    />
                </div>
            )}
        </div>
    );
};

export default YearFilter;
