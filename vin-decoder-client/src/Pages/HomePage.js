// HomePage.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";

import styles from "./HomePage.module.css";
import Sidebar from "../Navigation/Sidebar";
import NavigationBar from "../Navigation/NavigationBar";

const HomePage = () => {
  const [salesData, setSalesData] = useState(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/sales_data");
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchSalesData();
  }, []);

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    return monthNames[monthNumber - 1];
  };

  const prepareChartData = (data) => {
    const labels = data.map((item) => getMonthName(item.month));
    const revenueData = data.map((item) => item.revenue);
    const profitData = data.map((item) => item.profit);

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenueData,
          backgroundColor: "rgba(88, 131, 196, 0.65)",
        },
        {
          label: "Profit",
          data: profitData,
          backgroundColor: "rgba(75, 218, 89, 0.65)",
        },
      ],
    };
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
  };

  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.mainContent}>
        <div className={styles.monthlySales}>
          <div className={styles.monthlyNumbers}>
            <text>$Total</text>
            <text>#Sold</text>
            <button className={styles.btnViewMonthly}>
              View Monthly Report
            </button>
          </div>
          <div className={styles.monthlyGraph}></div>
        </div>
        <div className={styles.annualSales}>
          <div className={styles.annualNumbers}>
            <text>$Total</text>
            <text>#Sold</text>
            <button className={styles.btnViewYearly}>View Yearly Report</button>
          </div>
          <div className={styles.annualGraph}>
            {salesData && (
              <Bar data={prepareChartData(salesData)} options={chartOptions} />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
