// YearFilter.js
import React, { useState } from 'react';
import styles from './YearFilter.module.css';

const YearFilter = ({minYear, setMinYear, maxYear, SetMaxYear}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () =>{
        setIsExpanded(!isExpanded);
    };

    const handleMinYearChange = (e) => setMinYear(e.target.value);
    const handleMaxYearChange = (e) => SetMaxYear(e.target.value);

    return(
        <div className={styles.yearFilter}>
            <div className={styles.header} onClick={handleToggle}>
                <span>Year</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {isExpanded &&(
                <div className={styles.content}>
                    <input
                        type='number'
                        placeholder='min'
                        value={minYear}
                        onChange={handleMinYearChange}
                        className={styles.input}
                    />
                    <input
                        type='number'
                        placeholder='max'
                        value={minYear}
                        onChange={handleMaxYearChange}
                        className={styles.input}
                    />
                </div>
            )} 
        </div>
    );
};

export default YearFilter;