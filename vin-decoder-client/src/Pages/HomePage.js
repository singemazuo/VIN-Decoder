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
  const [vehiclesSoldCount, setVehiclesSoldCount] = useState(0);
  const [salesDifference, setSalesDifference] = useState(null);
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

  const colors = [
    "#fd7f6f", "#7eb0d5", "#b2e061", "#bd7ebe", "#ffb55a",
    "#ffee65", "#beb9db", "#fdcce5", "#8d8f97", "#D4F0F0",
    "#8FCACA", "#CCE2CB", "#B6CFB6", "#97C1A9", "#FCB9AA",
    "#FFDBCC", "#ECEAEA", "#A2E1DB", "#55BCBD", "#CBAACB",
    "#8FCACA", "#ECEAEA", "#FFCCB6", "#FF968A",
  ];

  const getColors = (count) => {
    let resultColors = [];
    for (let i = 0; i < count; i++) {
      resultColors.push(colors[i % colors.length]);
    }
    return resultColors;
  };

  useEffect(() => {
    const fetchVehiclesSoldThisMonth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/vehicles-sold-this-month"
        );
        setVehiclesSoldCount(response.data.count);
      } catch (error) {
        console.error("Error fetching vehicles sold this month:", error);
      }
    };

    fetchVehiclesSoldThisMonth();
  }, []);

  useEffect(() => {
    const fetchSalesDifference = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/vehicle-sales-difference"
        );
        setSalesDifference(response.data);
      } catch (error) {
        console.error("Error fetching sales difference:", error);
      }
    };

    fetchSalesDifference();
  }, []);

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

        const chartColors = getColors(makes.length);

        setChartData({
          labels: makes,
          datasets: [
            {
              label: "Vehicle Make Distribution",
              data: counts,
              backgroundColor: chartColors,
              hoverBackgroundColor: chartColors,
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
      "Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec",
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
        position: "top",
      },
    },
  };

  const profitChartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "top",
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
        position: "right",
      },
    },
  };

  const getDifferenceTextStyle = () => {
    if (salesDifference && salesDifference.percentage_difference > 0) {
      return { color: "green" };
    } else if (salesDifference && salesDifference.percentage_difference < 0) {
      return { color: "red" };
    } else {
      return {};
    }
  };

  const formatPercentageDifference = (difference) => {
    if (difference > 0) {
      return `+${difference.toFixed(2)}%`;
    } else {
      return `${difference.toFixed(2)}%`;
    }
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
              <button className={styles.btnViewYearly}>
                View Annual Report
              </button>
              <button className={styles.btnRefresh}>
                <img className={styles.refreshIcon} src="../icons/refresh.svg" alt="refresh"></img> Refresh Reports
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
            <div className={styles.monthlyButton}>
            <div className={styles.monthlyNumbers}>
              <p className={styles.title}>Sold this month</p>
              <div className={styles.centeredNumbers}>
                <h1><strong>{vehiclesSoldCount}</strong></h1>
                <h4 className={styles.difference} style={getDifferenceTextStyle()}>
                  {salesDifference ? formatPercentageDifference(salesDifference.percentage_difference) : null}
                </h4>
              </div>
            </div>
            <button className={styles.btnViewMonthly}>
                View Monthly Report
              </button>
            </div>
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
