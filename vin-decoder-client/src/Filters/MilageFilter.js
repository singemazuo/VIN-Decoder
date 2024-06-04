import React, { useState } from 'react';
import styles from './MilageFilter.module.css';


const MilageFilter = ({minMilage, setMinMilage, maxMilage, setMaxMilage}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    }

    const handleMinMilageChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMinMilage(value);
        }
    };

    const handleMaxMilageChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMaxMilage(value);
        }
    };

    return(
        <div className={styles.milageFilter}>
            <div className={styles.header} onClick={handleToggle}>
                <span>Milage</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
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

export default MilageFilter