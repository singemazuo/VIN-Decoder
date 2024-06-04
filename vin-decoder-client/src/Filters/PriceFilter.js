// PriceFilter.js
import React, { useState } from 'react';
import styles from './PriceFilter.module.css';

const PriceFilter = ({ minPrice, setMinPrice, maxPrice, setMaxPrice }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMinPrice(value);
        }
    };

    const handleMaxPriceChange = (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMaxPrice(value);
        }
    };

    return (
        <div className={styles.priceFilter}>
            <div className={styles.header} onClick={handleToggle}>
                <span>Price</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {isExpanded && (
                <div className={styles.content}>
                    <input
                        type="text"
                        placeholder="Min"
                        value={minPrice}
                        onChange={handleMinPriceChange}
                        className={styles.input}
                    />
                    <input
                        type="text"
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
