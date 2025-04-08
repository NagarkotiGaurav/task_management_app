import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('nearestDeadline');
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(2);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [totalTasksCount, setTotalTasksCount] = useState(0);
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchTasks();
  }, [sortBy, filterStatus, currentPage, tasksPerPage]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const countRes = await axios.get('http://localhost:3001/tasks', {
        params: { status: filterStatus || undefined },
      });
      setTotalTasksCount(countRes.data.length);

      const res = await axios.get('http://localhost:3001/tasks', {
        params: {
          _sort: sortBy === 'nearestDeadline' ? 'deadline' : sortBy,
          _order: 'asc',
          status: filterStatus || undefined,
          _page: currentPage,
          _per_page: tasksPerPage,
        },
      });

      setTasks(res.data.data);
    } catch (err) {
      setError('Failed to fetch tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    setCurrentPage(1);
  };

  const handleFilterStatus = (status) => {
    setFilterStatus(status);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const openNewTaskModal = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };

  const openEditTaskModal = (task) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsModalOpen(false);
    setEditTask(null);
  };

  const toggleSubtasks = (taskId) => {
    setExpandedTaskId((prevId) => (prevId === taskId ? null : taskId));
  };

  const logActivity = async (action, taskTitle) => {
    await axios.post('http://localhost:3001/logs', {
      action,
      taskTitle,
      timestamp: new Date().toISOString(),
    });
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              subtasks: task.subtasks.map((sub) =>
                sub.id === subtaskId ? { ...sub, done: !sub.done } : sub
              ),
            }
          : task
      )
    );
    const task = tasks.find(t => t.id === taskId);
    const sub = task?.subtasks.find(s => s.id === subtaskId);
    if (sub) logActivity("toggled subtask", sub.title);
  };

  const handleDeleteTask = async (id, title) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      console.log('Deleted Task:', title);
      fetchTasks();
    }
  };

  const handleSubmitTask = async (task) => {
    if (editTask) {
      await axios.put(`http://localhost:3001/tasks/${editTask.id}`, task);
      console.log('Updated Task:', task.title);
    } else {
      await axios.post('http://localhost:3001/tasks', task);
      console.log('Created Task:', task.title);
    }
    fetchTasks();
    closeTaskModal();
  };

  const totalPages = Math.ceil(totalTasksCount / tasksPerPage);

  if (loading) return <div className="p-4">Loading tasks...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <button
          onClick={openNewTaskModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          + New Task
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="sort" className="mr-2">Sort By:</label>
          <select id="sort" className="border rounded p-1" value={sortBy} onChange={(e) => handleSort(e.target.value)}>
            <option value="nearestDeadline">Nearest Deadline</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterStatus" className="mr-2">Filter Status:</label>
          <select id="filterStatus" className="border rounded p-1" value={filterStatus} onChange={(e) => handleFilterStatus(e.target.value)}>
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border-b text-left cursor-pointer" onClick={() => handleSort('title')}>Task Name</th>
              <th className="p-2 border-b text-left">Assignee</th>
              <th className="p-2 border-b text-left cursor-pointer" onClick={() => handleSort('deadline')}>Deadline</th>
              <th className="p-2 border-b text-left">Status</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 border-b">
                <td className="p-3 font-medium text-gray-800">
                  {task.title}
                  {expandedTaskId === task.id && task.subtasks && (
                    <ul className="ml-4 mt-2 space-y-1 text-sm text-gray-700">
                      <h3>Subtasks</h3>
                      {task.subtasks.map((sub) => (
                        <li key={sub.id} className="flex ps-7 items-center gap-2">
                          <input
                            type="checkbox"
                            checked={sub.done}
                            onChange={() => handleToggleSubtask(task.id, sub.id)}
                            className="cursor-pointer accent-green-600"
                          />
                          <span className={sub.done ? "line-through text-gray-500" : ""}>{sub.title}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </td>
                <td className="p-3 text-gray-700">{task.assignee}</td>
                <td className="p-3 text-gray-700">{formatDate(task.deadline)}</td>
                <td className="p-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    task.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-3 flex flex-col space-y-1">
                  <button onClick={() => openEditTaskModal(task)} className="text-blue-600 hover:underline text-sm">Edit</button>
                  <button onClick={() => handleDeleteTask(task.id, task.title)} className="text-red-600 hover:underline text-sm">Delete</button>
                  {task.subtasks && (
                    <button onClick={() => toggleSubtasks(task.id)} className="text-indigo-600 hover:underline text-sm mt-1">
                      Subtasks ({task.subtasks.length}) {expandedTaskId === task.id ? '▲' : '▼'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between items-center">
        <button
          className="bg-gray-200 px-3 py-1 rounded"
          onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="bg-gray-200 px-3 py-1 rounded"
          onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <TaskForm
          task={editTask}
          onSubmit={handleSubmitTask}
          onClose={closeTaskModal}
        />
      )}
    </div>
  );
};

export default Tasks;
