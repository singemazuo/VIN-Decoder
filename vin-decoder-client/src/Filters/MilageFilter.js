import React, { useState } from 'react';
import styles from './MilageFilter.module.css';

// MilageFilter component for filtering vehicles by milage range
const MilageFilter = ({ minMilage, setMinMilage, maxMilage, setMaxMilage }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    // Toggle the expanded state of the filter section
    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // Handle changes in the minimum milage input
    const handleMinMilageChange = (e) => {
        const value = e.target.value;
        // Only allow numeric input or empty string
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMinMilage(value);
        }
    };

    // Handle changes in the maximum milage input
    const handleMaxMilageChange = (e) => {
        const value = e.target.value;
        // Only allow numeric input or empty string
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMaxMilage(value);
        }
    };

    return (
        <div className={styles.milageFilter}>
            <div className={styles.header} onClick={handleToggle}>
                {/* Display the section title and toggle icon */}
                <span>Milage</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {/* Show the filter inputs if the section is expanded */}
            {isExpanded && (
                <div className={styles.content}>
                    <input
                        type="text"
                        placeholder="Min"
                        value={minMilage}
                        onChange={handleMinMilageChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
                        placeholder="Max"
                        value={maxMilage}
                        onChange={handleMaxMilageChange}
                        className={styles.input}
                    />
                </div>
            )}
        </div>
    );
};

export default MilageFilter;
