import React, { useState } from 'react';
import styles from './LoanCalc.module.css';
import Sidebar from '../Navigation/Sidebar';
import NavigationBar from '../Navigation/NavigationBar';

const LoanCalc = () => {
  const [result, setResult] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.target;

    const capitalizedCost = parseFloat(form.capitalizedCost.value);
    const residualValue = parseFloat(form.residualValue.value);
    const apr = parseFloat(form.apr.value) / 100;
    const term = parseInt(form.term.value);
    const salesTaxRate = parseFloat(form.salesTaxRate.value) / 100;
    const downPayment = parseFloat(form.downPayment.value);
    const fees = parseFloat(form.fees.value);

    const monthlyInterestRate = apr / 12;
    const depreciationFee = (capitalizedCost - residualValue) / term;
    const interestFee = (capitalizedCost + residualValue) * monthlyInterestRate;
    const monthlyPayment = depreciationFee + interestFee;

    const totalCost = (monthlyPayment * term) + downPayment + fees;
    const totalCostWithTax = totalCost + (totalCost * salesTaxRate);

    setResult({
      monthlyPayment: monthlyPayment.toFixed(2),
      totalCostWithTax: totalCostWithTax.toFixed(2),
    });
  };

  const handleReset = () => {
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
        <h3>Lease Payment Calculator</h3>
        <form className={styles.leaseForm} onSubmit={handleSubmit} onReset={handleReset}>
          <label htmlFor="capitalizedCost">Capitalized Cost ($):</label>
          <input className={styles.leaseInput} type="text" id="capitalizedCost" name="capitalizedCost" required /><br />

          <label htmlFor="residualValue">Residual Value ($):</label>
          <input className={styles.leaseInput} type="text" id="residualValue" name="residualValue" required /><br />

          <label htmlFor="apr">APR (%):</label>
          <input className={styles.leaseInput} type="text" id="apr" name="apr" required /><br />

          <label htmlFor="term">Term (months):</label>
          <input className={styles.leaseInput} type="text" id="term" name="term" required /><br />

          <label htmlFor="salesTaxRate">Sales Tax Rate (%):</label>
          <input className={styles.leaseInput} type="text" id="salesTaxRate" name="salesTaxRate" required /><br />

          <label htmlFor="downPayment">Down Payment ($):</label>
          <input className={styles.leaseInput} type="text" id="downPayment" name="downPayment" required /><br />

          <label htmlFor="fees">Fees ($):</label>
          <input className={styles.leaseInput} type="text" id="fees" name="fees" required /><br />

          <div className={styles.leaseButtons}>
            <button className={styles.btnCalculate} type="submit">Calculate</button>
            <button className={styles.btnClear} type="reset">Clear</button>
          </div>
        </form>
        {result && (
          <div className={styles.result}>
            <h2>Monthly Payment: ${result.monthlyPayment}</h2>
            <h2>Total Cost with Tax: ${result.totalCostWithTax}</h2>
          </div>
        )}
      </div>
    </>
  );
};

export default LoanCalc;
