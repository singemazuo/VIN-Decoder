import React, { useState } from 'react';
import styles from './YearFilter.module.css';

const YearFilter = ({ minYear, setMinYear, maxYear, setMaxYear }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMinYearChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMinYear(value);
        }
    };

    const handleMaxYearChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMaxYear(value);
        }
    };

    return (
        <div className={styles.yearFilter}>
            <div className={styles.header} onClick={handleToggle}>
                <span>Year</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {isExpanded && (
                <div className={styles.content}>
                    <input
                        type="text"
                        placeholder="Min"
                        value={minYear}
                        onChange={handleMinYearChange}
                        className={styles.input}
                    />
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
