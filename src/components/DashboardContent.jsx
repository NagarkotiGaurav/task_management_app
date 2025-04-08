import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios'
import ActivityLog from './ActivityLog';

ChartJS.register(ArcElement, Tooltip, Legend);

const DashboardContent = () => {
  const [tasks, setTasks] = useState([]);
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:3001/tasks'); // your mock server
        setTasks(response.data);
        console.log(tasks);
        
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      }
    };

    const fetchLogs = async () => {
      try {
        const res = await axios.get('http://localhost:3001/logs?_sort=timestamp&_order=desc&_limit=5');
        
        setLogs(res.data);
      } catch (error) {
        console.error('Failed to fetch logs:', error);
      }
    };

    fetchTasks();
    fetchLogs();
  }, []);

  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const pendingTasks = tasks.filter(task => task.status !== 'Completed').length;

  const chartData = {
    labels: ['Completed', 'Pending'],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ['#4ade80', '#f87171'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 space-y-8">
      

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-green-100 p-4 rounded-xl shadow">
          <h3 className="text-lg">Total Tasks</h3>
          <p className="text-2xl font-bold">{tasks.length}</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl shadow">
          <h3 className="text-lg">Completed</h3>
          <p className="text-2xl font-bold">{completedTasks}</p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl shadow">
          <h3 className="text-lg">Pending</h3>
          <p className="text-2xl font-bold">{pendingTasks}</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow max-w-md">
        <h3 className="text-xl font-semibold mb-4">Task Status</h3>
        <Doughnut data={chartData} />
      </div>

      <div className="p-4">
      <h2 className="text-xl font-semibold mb-3"> Recent Activity Logs</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="border p-2 rounded bg-gray-50">
            <span className="font-semibold">{log.action}</span> — <span>{log.taskTitle}</span>
            <div className="text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>

    </div>
  );
};

export default DashboardContent;
