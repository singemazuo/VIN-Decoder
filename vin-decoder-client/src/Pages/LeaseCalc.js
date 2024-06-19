import React, { useState } from 'react';
import styles from './LeaseCalc.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';

const LeaseCalc = () => {
  // State for form data and result
  const [formData, setFormData] = useState({
    capitalizedCost: 0,
    residualValue: 0,
    apr: 0,
    term: 1,
    salesTaxRate: 0.1,
    downPayment: 0,
    fees: 0,
  });

  const [result, setResult] = useState(null);

  // Handle input changes in the form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: parseFloat(value),
    });
  };

  // Handle form submission to calculate the lease payment
  const handleSubmit = (event) => {
    event.preventDefault();
    const { capitalizedCost, residualValue, apr, term, salesTaxRate, downPayment, fees } = formData;

    const monthlyInterestRate = apr / 100 / 12;
    const depreciationFee = (capitalizedCost - residualValue) / term;
    const interestFee = (capitalizedCost + residualValue) * monthlyInterestRate;
    const monthlyPayment = depreciationFee + interestFee;

    const totalCost = (monthlyPayment * term) + downPayment + fees;
    const totalCostWithTax = totalCost + (totalCost * salesTaxRate / 100);

    setResult({
      monthlyPayment: isNaN(monthlyPayment) ? '0.00' : monthlyPayment.toFixed(2),
      totalCostWithTax: isNaN(totalCostWithTax) ? '0.00' : totalCostWithTax.toFixed(2),
    });
  };

  // Handle form reset to clear the input fields and result
  const handleReset = () => {
    setFormData({
      capitalizedCost: 0,
      residualValue: 0,
      apr: 0,
      term: 1,
      salesTaxRate: 15,
      downPayment: 0,
      fees: 0,
    });
    setResult(null);
  };

  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.container}>
        <h1 className={styles.h1}>Lease Payment Calculator</h1>
        <form className={styles.leaseForm} onSubmit={handleSubmit} onReset={handleReset}>
          {/* Input fields for lease calculation */}
          <div className={styles.formGroup}>
            <label htmlFor="capitalizedCost">Capitalized Cost ($):</label>
            <input
              type="number"
              id="capitalizedCost"
              name="capitalizedCost"
              value={formData.capitalizedCost}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="residualValue">Residual Value ($):</label>
            <input
              type="number"
              id="residualValue"
              name="residualValue"
              value={formData.residualValue}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="apr">APR (%):</label>
            <input
              type="number"
              id="apr"
              name="apr"
              value={formData.apr}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="term">Term (months):</label>
            <input
              type="number"
              id="term"
              name="term"
              value={formData.term}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="salesTaxRate">Sales Tax Rate (%):</label>
            <input
              type="number"
              id="salesTaxRate"
              name="salesTaxRate"
              value={formData.salesTaxRate}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="downPayment">Down Payment ($):</label>
            <input
              type="number"
              id="downPayment"
              name="downPayment"
              value={formData.downPayment}
              onChange={handleChange}
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="fees">Fees ($):</label>
            <input
              type="number"
              id="fees"
              name="fees"
              value={formData.fees}
              onChange={handleChange}
            />
          </div>
          {/* Buttons for submitting and resetting the form */}
          <div className={styles.buttons}>
            <button className={styles.button} type="submit">Calculate</button>
            <button className={styles.button} type="reset">Clear</button>
          </div>
        </form>
        {/* Display the result of the calculation */}
        {result && (
          <>
            <h2 className={styles.h2} id="result">Calculation Result</h2>
            <table id="paymentTable" className={styles.paymentTable}>
              <thead>
                <tr>
                  <th>Monthly Payment</th>
                  <th>Total Cost with Tax</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${result.monthlyPayment}</td>
                  <td>${result.totalCostWithTax}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default LeaseCalc;
