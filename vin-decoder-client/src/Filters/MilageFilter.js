import React, { useState } from 'react';
import styles from './MilageFilter.module.css';


const MilageFilter = ({minMilage, setMinMilage, maxMilage, setMaxMilage}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    }

    const handleMinMilageChange = (e) => setMinMilage(e.target.value);
    const handleMaxMilageChange = (e) => setMaxMilage(e.target.value);

    return(
        <div className={styles.milageFilter}>
            <div className={styles.header} onClick={handleToggle}>
                <span>Milage</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {isExpanded && (
                <div className={styles.content}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minMilage}
                        onChange={handleMinMilageChange}
                        className={styles.input}
                    />
                    <input
                        type="number"
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