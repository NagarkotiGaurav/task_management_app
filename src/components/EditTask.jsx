// src/pages/EditTask.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditTask = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    deadline: '',
    status: 'To Do'
  });

  useEffect(() => {
    // Fetch task data by ID
    axios.get(`http://localhost:3001/tasks/?${id}`)
      .then(res => setTask(res.data))
      .catch(err => console.error("Error fetching task:", err));
  }, [id]);

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:3001/tasks/${id}`, task)
      .then(() => {
        alert("Task updated successfully");
        navigate('/dashboard/tasks');
      })
      .catch(err => console.error("Error updating task:", err));
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title"  defaultValue={task.title} onChange={handleChange} placeholder="Title" className="w-full p-2 border rounded" />
        <textarea name="description" value={task.description} onChange={handleChange} placeholder="Description" className="w-full p-2 border rounded" />
        <input name="assignee" value={task.assignee} onChange={handleChange} placeholder="Assignee" className="w-full p-2 border rounded" />

        <select name="priority" value={task.priority} onChange={handleChange} className="w-full p-2 border rounded">
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <input type="date" name="deadline" value={task.deadline} onChange={handleChange} className="w-full p-2 border rounded" />

        <select name="status" value={task.status} onChange={handleChange} className="w-full p-2 border rounded">
          <option>To Do</option>
          <option>In Progress</option>
          <option>Done</option>
        </select>

        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Update Task</button>
      </form>
    </div>
  );
};

export default EditTask;
