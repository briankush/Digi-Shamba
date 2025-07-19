import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import './MonthlyAnalytics.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

const API = import.meta.env.VITE_API_BASE_URL;

const MonthlyAnalytics = () => {
  const [selectedMonth, setSelectedMonth] = useState(moment().format('YYYY-MM'));
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthlyAnalytics();
  }, [selectedMonth]);

  const fetchMonthlyAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API}/analytics/monthly/${selectedMonth}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;
  if (!analytics) return <div className="no-data">No data available for this month</div>;

  const dailyIncomeData = {
    labels: analytics.dailyData?.map(d => moment(d.date).format('DD')) || [],
    datasets: [{
      label: 'Daily Income',
      data: analytics.dailyData?.map(d => d.income || 0) || [],
      backgroundColor: '#4CAF50',
      borderColor: '#45a049',
      borderWidth: 1
    }]
  };

  const expenseVsIncomeData = {
    labels: analytics.dailyData?.map(d => moment(d.date).format('DD')) || [],
    datasets: [
      {
        label: 'Income',
        data: analytics.dailyData?.map(d => d.income || 0) || [],
        borderColor: '#4CAF50',
        backgroundColor: 'rgba(76, 175, 80, 0.2)',
        tension: 0.1
      },
      {
        label: 'Expenses',
        data: analytics.dailyData?.map(d => d.expenses || 0) || [],
        borderColor: '#f44336',
        backgroundColor: 'rgba(244, 67, 54, 0.2)',
        tension: 0.1
      }
    ]
  };

  return (
    <div className="monthly-analytics">
      <h2>Monthly Analytics</h2>
      
      <div className="month-selector">
        <label>Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        />
      </div>

      <div className="analytics-summary">
        <div className="summary-card">
          <h3>Total Income</h3>
          <p className="amount positive">${analytics.totalIncome?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <p className="amount negative">${analytics.totalExpenses?.toFixed(2) || '0.00'}</p>
        </div>
        <div className="summary-card">
          <h3>Net Profit</h3>
          <p className={`amount ${analytics.netProfit >= 0 ? 'positive' : 'negative'}`}>
            ${analytics.netProfit?.toFixed(2) || '0.00'}
          </p>
        </div>
        <div className="summary-card">
          <h3>Records Completed</h3>
          <p className="record-count">{analytics.recordsCompleted} / {analytics.totalDays}</p>
        </div>
      </div>

      <div className="charts-container">
        <div className="chart">
          <h3>Daily Income</h3>
          <Bar data={dailyIncomeData} options={{ responsive: true }} />
        </div>
        
        <div className="chart">
          <h3>Income vs Expenses Trend</h3>
          <Line data={expenseVsIncomeData} options={{ responsive: true }} />
        </div>
      </div>

      {analytics.commonActivities && analytics.commonActivities.length > 0 && (
        <div className="activities-summary">
          <h3>Most Common Activities</h3>
          <ul>
            {analytics.commonActivities.map((activity, index) => (
              <li key={index}>
                <span className="activity-name">{activity.activity}</span>
                <span className="activity-count">{activity.count} times</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MonthlyAnalytics;