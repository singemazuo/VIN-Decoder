// PriceFilter.js
import React, { useState } from 'react';
import styles from './PriceFilter.module.css';

const PriceFilter = ({ minPrice, setMinPrice, maxPrice, setMaxPrice }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMinPriceChange = (e) => setMinPrice(e.target.value);
    const handleMaxPriceChange = (e) => setMaxPrice(e.target.value);

    return (
        <div className={styles.priceFilter}>
            <div className={styles.header} onClick={handleToggle}>
                <span>Price</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {isExpanded && (
                <div className={styles.content}>
                    <input
                        type="number"
                        placeholder="Min"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className={styles.input}
                    />
                    <input
                        type="number"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={handleMaxPriceChange}
                        className={styles.input}
                    />
                </div>
            )}
        </div>
    );
};

export default PriceFilter;
