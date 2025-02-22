import React, { useState, useEffect, useRef } from "react";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import "./index.css";

// Register chart components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const TransactionDashboard = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("March");
  const [stats, setStats] = useState({
    totalSalesAmount: 0,
    totalSoldItems: 0,
    totalNotSoldItems: 0,
  });
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [debouncedSearchText, setDebouncedSearchText] = useState(searchText);
  const [debouncedMonth, setDebouncedMonth] = useState(selectedMonth);
  const [loading, setLoading] = useState(true);
  const rowsPerPage = 3; // Updated to 3 rows per page
  const [totalPages, setTotalPages] = useState(1);
  const pieChartColorsRef = useRef({}); // Cache colors by month

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Debouncing search input
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchText(searchText), 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  // Debouncing month selection
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedMonth(selectedMonth), 300);
    return () => clearTimeout(timer);
  }, [selectedMonth]);

  // Fetch transactions and statistics
  useEffect(() => {
    setLoading(true);
    fetchAllTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [debouncedSearchText, debouncedMonth, page]);

  useEffect(() => {
    sliceTransactions();
  }, [allTransactions, page]);

  const fetchAllTransactions = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions",
        {
          params: { month: selectedMonth, search: debouncedSearchText, page },
        }
      );
      setAllTransactions(response.data.transactions);
      setTotalPages(Math.ceil(response.data.totalTransactions / rowsPerPage)); // Set total pages dynamically
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const sliceTransactions = () => {
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    setTransactions(allTransactions.slice(startIndex, endIndex));
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions/statistics",
        {
          params: { month: selectedMonth },
        }
      );
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions/bar-chart",
        {
          params: { month: selectedMonth },
        }
      );

      const labels = Object.keys(response.data);
      const data = Object.values(response.data);

      setBarChartData({
        labels,
        datasets: [
          {
            label: "Count",
            data,
            backgroundColor: "#82ca9d",
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/transactions/pie-chart",
        {
          params: { month: selectedMonth },
        }
      );

      const labels = Object.keys(response.data);
      const data = Object.values(response.data);

      // Cache colors by month to ensure colors remain consistent for each month
      if (!pieChartColorsRef.current[selectedMonth]) {
        pieChartColorsRef.current[selectedMonth] = generateColors(
          labels.length
        );
      }

      setPieChartData({
        labels,
        datasets: [
          {
            label: "Items",
            data,
            backgroundColor: pieChartColorsRef.current[selectedMonth],
          },
        ],
      });
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  const generateColors = (numColors) => {
    const colors = [];
    for (let i = 0; i < numColors; i++) {
      colors.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
    }
    return colors;
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "grey", // Set grid lines to white
        },
        title: {
          display: true,
          text: "Count", // Y-axis label
          color: "white",
        },
        ticks: {
          color: "white",
        },
      },
      x: {
        title: {
          display: true,
          text: "Price Range", // X-axis label
          color: "white",
        },
        ticks: {
          color: "white",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "white", // Legend labels color
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top", // Or 'top', 'left', 'right'
        labels: {
          color: "white", // Pie chart legend labels color
          font: {
            // Add font property to increase font size
            size: 15, // Adjust the font size as needed
          },
          padding: 20, // Adjust padding between legend items
          boxWidth: 20, // Adjust the width of the color box
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.label || "";
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(2) + "%";
            return `${label}: ${percentage}`;
          },
        },
      },
      datalabels: {
        formatter: (value, context) => {
          const label = context.chart.data.labels[context.dataIndex];
          const total = context.chart.data.datasets[0].data.reduce(
            (a, b) => a + b,
            0
          );
          const percentage = ((value / total) * 100).toFixed(2) + "%";
          return `${label}: ${percentage}`;
        },
        color: "white",
      },
    },
  };

  return (
    <div className="main-container">
      <aside className="sidebar">
        <h2>Dashboard</h2>
        <div className="sidebar-item">
          <strong>Selected Month:</strong> {selectedMonth}
        </div>
        <div className="sidebar-item">
          <strong>Total Sales:</strong> {stats.totalSalesAmount}
        </div>
        <div className="sidebar-item">
          <strong>Sold Items:</strong> {stats.totalSoldItems}
        </div>
        <div className="sidebar-item">
          <strong>Not Sold Items:</strong> {stats.totalNotSoldItems}
        </div>
        <div className="sidebar-item">
          <strong>Current Page:</strong> {page}
        </div>
        <div className="sidebar-item">
          <strong>Total Pages:</strong> {totalPages}
        </div>
        <div className="sidebar-item">
          <strong>Rows Per Page:</strong> {rowsPerPage}
        </div>
      </aside>
      <div className="content">
        <h1>Transaction Dashboard</h1>

        {/* Search and Month Selection */}
        <div className="search-month-container">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-button"
            />
          </div>

          <div className="month-container">
            <label>Select Month: </label>
            <select
              className="month-dropdown-button"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="table-container">
          <div className="table-button-con">
            <h2>Transactions</h2>
            {/* Pagination buttons */}
            <div className="pagination-container">
              <button
                onClick={() => setPage(page - 1)}
                className={page === 1 ? "disabled-button" : ""}
                disabled={page === 1}
              >
                Previous
              </button>

              <button
                onClick={() => setPage(page + 1)}
                className={page === totalPages ? "disabled-button" : ""}
                disabled={page === totalPages}
              >
                Next
              </button>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Description</th>
                <th>Price</th>
                <th>Category</th>
                <th>Sold</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{transaction.id}</td>
                  <td style={{ maxWidth: "300px" }}>{transaction.title}</td>
                  <td
                    style={{
                      margin: "12px",
                    }}
                  >
                    {transaction.description}
                  </td>
                  <td>{transaction.price}</td>
                  <td>{transaction.category}</td>
                  <td>{transaction.sold ? "✅" : "❌"}</td>
                  <td>
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "fill",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="page-con">
            <p> Page No: {page}</p>
            <p> Per Page : 3</p>
          </div>
        </div>

        {/* Div container for statistics and charts */}
        <div className="stats-charts-wrapper">
          {/* Display Bar Chart */}
          {barChartData && (
            <div className="chart-container">
              <h2>Price Range Distribution - {selectedMonth}</h2>
              <Bar data={barChartData} options={options} />
            </div>
          )}
          <div className="stats-container">
            <h2>Statistics - {selectedMonth}</h2>
            <div className="stats-card">
              <h4>Total Sales Amount</h4>
              <p>{stats.totalSalesAmount}</p>
            </div>
            <div className="stats-card">
              <h4>Total Sold Items</h4>
              <p>{stats.totalSoldItems}</p>
            </div>
            <div className="stats-card">
              <h4>Total Not Sold Items</h4>
              <p>{stats.totalNotSoldItems}</p>
            </div>
          </div>
          {/* Display Pie Chart */}
          {pieChartData && (
            <div className="chart-container pie-container">
              <h2>Category Distribution - {selectedMonth}</h2>
              <Pie
                data={pieChartData}
                options={pieOptions}
                className="pie-chart"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionDashboard;
