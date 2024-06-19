import React, { useState } from 'react';
import styles from './LoanCalc.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';

const LoanCalc = () => {
  // State for form data and result
  const [formData, setFormData] = useState({
    price: 0,
    tradeIn: 0,
    loanBalance: 0,
    downPayment: 0,
    loanDuration: 1,
    salesTax: 0.1,
    interestRate: 0,
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

  // Handle form submission to calculate the loan payment
  const handleSubmit = (e) => {
    e.preventDefault();
    const {
      price,
      tradeIn,
      loanBalance,
      downPayment,
      loanDuration,
      salesTax,
      interestRate,
    } = formData;

    // Calculate total cost and total cost with tax
    const totalCost = price - tradeIn - loanBalance - downPayment;
    const totalCostWithTax = totalCost + totalCost * (salesTax / 100);

    let monthlyPayment, biweeklyPayment, weeklyPayment;

    if (interestRate === 0) {
      // If interest rate is 0, calculate payments directly
      monthlyPayment = totalCostWithTax / loanDuration;
      biweeklyPayment = totalCostWithTax / (loanDuration * 2);
      weeklyPayment = totalCostWithTax / (loanDuration * 4);
    } else {
      // Calculate payments with interest
      const monthlyInterestRate = interestRate / 100 / 12;
      monthlyPayment = (totalCostWithTax * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -loanDuration));

      const biweeklyInterestRate = interestRate / 100 / 26;
      biweeklyPayment = (totalCostWithTax * biweeklyInterestRate) / (1 - Math.pow(1 + biweeklyInterestRate, -(loanDuration * 2)));

      const weeklyInterestRate = interestRate / 100 / 52;
      weeklyPayment = (totalCostWithTax * weeklyInterestRate) / (1 - Math.pow(1 + weeklyInterestRate, -(loanDuration * 4)));
    }

    // Calculate total interest
    const totalInterestMonthly = monthlyPayment * loanDuration - totalCostWithTax;
    const totalInterestBiweekly = biweeklyPayment * loanDuration * 2 - totalCostWithTax;
    const totalInterestWeekly = weeklyPayment * loanDuration * 4 - totalCostWithTax;

    // Set result state with calculated values
    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      biweeklyPayment: biweeklyPayment.toFixed(2),
      weeklyPayment: weeklyPayment.toFixed(2),
      totalInterestMonthly: totalInterestMonthly.toFixed(2),
      totalInterestBiweekly: totalInterestBiweekly.toFixed(2),
      totalInterestWeekly: totalInterestWeekly.toFixed(2),
    });
  };

  // Handle form reset to clear the input fields and result
  const handleReset = () => {
    setFormData({
      price: 0,
      tradeIn: 0,
      loanBalance: 0,
      downPayment: 0,
      loanDuration: 1,
      salesTax: 15,
      interestRate: 0,
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
        <h1 className={styles.h1}>Loan Payment Calculator</h1>
        <form className={styles.loanForm} onSubmit={handleSubmit} onReset={handleReset}>
          {/* Input fields for loan calculation */}
          <div className={styles.formGroup}>
            <label htmlFor="price">Price of your new vehicle ($) (excluding Tax):</label>
            <input
              type="range"
              id="price"
              name="price"
              min="0"
              max="100000"
              step="100"
              value={formData.price}
              onChange={handleChange}
            />
            <output>${formData.price}</output>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="tradeIn">Value of your trade-in vehicle ($):</label>
            <input
              type="range"
              id="tradeIn"
              name="tradeIn"
              min="0"
              max="50000"
              step="100"
              value={formData.tradeIn}
              onChange={handleChange}
            />
            <output>${formData.tradeIn}</output>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="loanBalance">Your existing vehicle loan balance ($):</label>
            <input
              type="range"
              id="loanBalance"
              name="loanBalance"
              min="0"
              max="50000"
              step="100"
              value={formData.loanBalance}
              onChange={handleChange}
            />
            <output>${formData.loanBalance}</output>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="downPayment">Your down payment ($):</label>
            <input
              type="range"
              id="downPayment"
              name="downPayment"
              min="0"
              max="50000"
              step="100"
              value={formData.downPayment}
              onChange={handleChange}
            />
            <output>${formData.downPayment}</output>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="loanDuration">Duration of your loan (months):</label>
            <input
              type="range"
              id="loanDuration"
              name="loanDuration"
              min="1"
              max="96"
              step="1"
              value={formData.loanDuration}
              onChange={handleChange}
            />
            <output>{formData.loanDuration} mo</output>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="salesTax">Provincial sales tax (%):</label>
            <input
              type="range"
              id="salesTax"
              name="salesTax"
              min="0.1"
              max="20"
              step="0.1"
              value={formData.salesTax}
              onChange={handleChange}
            />
            <output>{formData.salesTax}%</output>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="interestRate">Expected interest rate (%):</label>
            <input
              type="range"
              id="interestRate"
              name="interestRate"
              min="0"
              max="20"
              step="0.1"
              value={formData.interestRate}
              onChange={handleChange}
            />
            <output>{formData.interestRate}%</output>
          </div>
          {/* Buttons for submitting and resetting the form */}
          <div className={styles.buttons}>
            <button className={styles.button} type="submit">Calculate</button>
            <button className={styles.button} type="reset">Reset</button>
          </div>
        </form>
        {/* Display the result of the calculation */}
        {result && (
          <>
            <h2 className={styles.h2} id="result">Calculation Result</h2>
            <table id="paymentTable" className={styles.paymentTable}>
              <thead>
                <tr>
                  <th>Payment Frequency</th>
                  <th>Payment Amount</th>
                  <th>Total Interest to be Paid over the Duration of the Loan</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly</td>
                  <td id="monthlyPayment">${result.monthlyPayment}</td>
                  <td id="monthlyInterest">${result.totalInterestMonthly}</td>
                </tr>
                <tr>
                  <td>Bi-weekly</td>
                  <td id="biweeklyPayment">${result.biweeklyPayment}</td>
                  <td id="biweeklyInterest">${result.totalInterestBiweekly}</td>
                </tr>
                <tr>
                  <td>Weekly</td>
                  <td id="weeklyPayment">${result.weeklyPayment}</td>
                  <td id="weeklyInterest">${result.totalInterestWeekly}</td>
                </tr>
              </tbody>
            </table>
          </>
        )}
      </div>
    </>
  );
};

export default LoanCalc;
