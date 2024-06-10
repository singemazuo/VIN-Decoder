import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";
import styles from "./HomePage.module.css";
import Sidebar from "../Navigation/Sidebar";
import NavigationBar from "../Navigation/NavigationBar";

const HomePage = () => {
  const [revenueData, setRevenueData] = useState(null);
  const [profitData, setProfitData] = useState(null);
  const [vehiclesSold, setVehiclesSold] = useState(null);
  const [averageProfit, setAverageProfit] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Vehicle Make Distribution",
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        cutout: "50%", 
      },
    ],
  });

  useEffect(() => {
    const fetchVehicleMakeDistribution = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/vehicle-make-distribution"
        );
        const data = response.data;
        console.log(data);

        const makes = data.map((item) => item.make);
        const counts = data.map((item) => item.count);

        setChartData({
          labels: makes,
          datasets: [
            {
              label: "Vehicle Make Distribution",
              data: counts,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF9F40",
                "#4BC0C0",
                "#9966FF",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF9F40",
              ],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF9F40",
                "#4BC0C0",
                "#9966FF",
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#FF9F40",
              ],
              cutout: "50%", 
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching vehicle make distribution:", error);
      }
    };

    fetchVehicleMakeDistribution();
  }, []);

  useEffect(() => {
    const fetchVehiclesSold = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/vehicles_sold_past_year"
        );
        setVehiclesSold(response.data.count);
      } catch (error) {
        console.error("Error fetching vehicles sold in the past year:", error);
      }
    };

    fetchVehiclesSold();
  }, []);

  useEffect(() => {
    const fetchAverageProfit = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/get_average_profit"
        );
        setAverageProfit(response.data.average_profit);
      } catch (error) {
        console.error("Error fetching average profit:", error);
      }
    };
    fetchAverageProfit();
  }, []);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/revenue_data");
        setRevenueData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchRevenueData();
  }, []);

  useEffect(() => {
    const fetchProfitData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/profit_data");
        setProfitData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchProfitData();
  }, []);

  const getMonthName = (monthNumber) => {
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "June",
      "July",
      "Aug",
      "Sept",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthNames[monthNumber - 1];
  };

  const prepareRevenueChartData = (data) => {
    const labels = data.map((item) => getMonthName(item.month));
    const revenueData = data.map((item) => item.revenue);

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenueData,
          backgroundColor: "rgba(88, 131, 196, 0.65)",
        },
      ],
    };
  };

  const prepareProfitChartData = (data) => {
    const labels = data.map((item) => getMonthName(item.month));
    const profitData = data.map((item) => item.profit);

    return {
      labels,
      datasets: [
        {
          label: "Profit",
          data: profitData,
          backgroundColor: "rgba(75, 218, 89, 0.65)",
        },
      ],
    };
  };

  const revenueChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  const profitChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 15000,
      },
    },
  };

  const pieChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
      },
    },
  };

  return (
    <>
      <div className={styles.sideBar}>
        <Sidebar />
      </div>
      <div className={styles.navBar}>
        <NavigationBar />
      </div>
      <div className={styles.content}>
        <div className={styles.mainContent}>
          <div className={styles.annualSales}>
            <div className={styles.reportButtons}>
              <button className={styles.btnViewMonthly}>
                View Monthly Report
              </button>
              <button className={styles.btnViewYearly}>
                View Annual Report
              </button>
            </div>

            <div className={styles.annualGraph}>
              {revenueData && (
                <Bar
                  data={prepareRevenueChartData(revenueData)}
                  options={revenueChartOptions}
                />
              )}
            </div>
            <div className={styles.annualGraph}>
              {profitData && (
                <Bar
                  data={prepareProfitChartData(profitData)}
                  options={profitChartOptions}
                />
              )}
            </div>
          </div>
          <div className={styles.annualGrid}>
            <div></div>
            <div className={styles.annualNumbers}>
              <text>
                <strong>{vehiclesSold} </strong>
              </text>
            </div>
            <div className={styles.annualNumbers}>
              <text>
                <strong>${averageProfit}</strong>
              </text>
            </div>
            <div className={styles.annualNumbers}>
              <text>
                <strong>${averageProfit}</strong>
              </text>
            </div>
          </div>
          <div className={styles.monthlySales}>
            <div className={styles.monthlyNumbers}>
              <text>$Total</text>
              <text>#Sold</text>
            </div>
            <div className={styles.monthlyGraph}></div>
            <div className={styles.chartContainer}>
              <Pie data={chartData} options={pieChartOptions} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
