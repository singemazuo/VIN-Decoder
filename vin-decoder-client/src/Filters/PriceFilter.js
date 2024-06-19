import React, { useState } from 'react';
import styles from './PriceFilter.module.css';

// PriceFilter component for filtering vehicles by price range
const PriceFilter = ({ minPrice, setMinPrice, maxPrice, setMaxPrice }) => {
    // State to track if the filter section is expanded or collapsed
    const [isExpanded, setIsExpanded] = useState(false);

    // Toggle the expanded state of the filter section
    const handleToggle = () => {
        setIsExpanded(!isExpanded);
    };

    // Handle changes in the minimum price input
    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        // Only allow numeric input or empty string
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMinPrice(value);
        }
    };

    // Handle changes in the maximum price input
    const handleMaxPriceChange = (e) => {
        const value = e.target.value;
        // Only allow numeric input or empty string
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setMaxPrice(value);
        }
    };

    return (
        <div className={styles.priceFilter}>
            <div className={styles.header} onClick={handleToggle}>
                {/* Display the section title and toggle icon */}
                <span>Price</span>
                <span>{isExpanded ? '-' : '+'}</span>
            </div>
            {/* Show the filter inputs if the section is expanded */}
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
