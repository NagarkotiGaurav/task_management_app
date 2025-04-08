import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    const res = await axios.get('http://localhost:3001/logs?_sort=timestamp');
    setLogs(res.data.reverse());
    console.log(logs);
    
     // latest first
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Activity Logs</h2>
      <ul className="space-y-2">
        {logs.map((log, idx) => (
          <li key={idx} className="border p-2 rounded bg-gray-50">
            <span className="font-semibold">{log.action}</span> — <span>{log.taskTitle}</span>
            <div className="text-sm text-gray-600">{new Date(log.timestamp).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityLog;
