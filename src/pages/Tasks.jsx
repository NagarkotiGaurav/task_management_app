import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Import the TaskForm component (assuming you have it)
import TaskForm from '../components/TaskForm';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('nearestDeadline'); // Changed default sort
  const [filterStatus, setFilterStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [tasksPerPage] = useState(2); // Use useState for immutability
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [totalTasksCount, setTotalTasksCount] = useState(0);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchTasks();
    
  }, [sortBy, filterStatus, currentPage, tasksPerPage]); // Include tasksPerPage



  const fetchTasks = async () => {
  setLoading(true);
  setError(null);
  try {
    // Step 1: Get total count without _embed (json-server skips total header if _embed is used)
    const countRes = await axios.get('http://localhost:3001/tasks', {
      params: {
        status: filterStatus || undefined,
      },
    });
    setTotalTasksCount(countRes.data.length); // Set total task count for pagination

    // Step 2: Fetch paginated tasks with subtasks
    const res = await axios.get('http://localhost:3001/tasks', {
      params: {
        _sort: sortBy === 'nearestDeadline' ? 'deadline' : sortBy,
        _order: 'asc',
        status: filterStatus || undefined,
        _page: currentPage,
        _per_page: tasksPerPage,
      },
    });
    console.log(currentPage)
    console.log(res.data)
    setLoading(false)
    setTasks(res.data.data); // Set tasks with subtasks
  } catch (err) {
    setError('Failed to fetch tasks.');
    console.error('Error fetching tasks:', err);
  } finally {
    setLoading(false);
  }
};
const [showSubtasks, setShowSubtasks] = useState(false);


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

  const handleSubmitTask = async (task) => {
    if (editTask) {
      await axios.put(`http://localhost:3001/tasks/${editTask.id}`, task);
      console.log('Updated Task:', task.title); // Replace with your logActivity function
    } else {
      await axios.post('http://localhost:3001/tasks', task);
      console.log('Created Task:', task.title); // Replace with your logActivity function
    }
    fetchTasks();
    closeTaskModal();
  };

  const handleDeleteTask = async (id, title) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await axios.delete(`http://localhost:3001/tasks/${id}`);
      console.log('Deleted Task:', title); // Replace with your logActivity function
      fetchTasks();
    }
  };

  const totalPages = Math.ceil(totalTasksCount / tasksPerPage);

  if (loading) {
    return <div className="p-4">Loading tasks...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Tasks</h2>
        <button
          onClick={openNewTaskModal}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          + New Task
        </button>
      </div>

      <div className="mb-4 flex items-center space-x-4">
        <div>
          <label htmlFor="sort" className="mr-2">Sort By:</label>
          <select
            id="sort"
            className="border rounded p-1"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="nearestDeadline">Nearest Deadline</option>
            <option value="title">Title</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterStatus" className="mr-2">Filter Status:</label>
          <select
            id="filterStatus"
            className="border rounded p-1"
            value={filterStatus}
            onChange={(e) => handleFilterStatus(e.target.value)}
          >
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
              <th className="p-2 border-b text-left cursor-pointer" onClick={() => handleSort('title')}>
                Task Name
              </th>
              <th className="p-2 border-b text-left">Assignee</th>
              <th className="p-2 border-b text-left cursor-pointer" onClick={() => handleSort('deadline')}>
                Deadline
              </th>
              <th className="p-2 border-b text-left">Status</th>
              <th className="p-2 border-b text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <>
              
              
              <tr key={task.id} className="hover:bg-gray-50">
                <td className="p-2 border-b">
                  <Link to={`/tasks/${task.id}`} className="underline text-blue-600">
                    {task.title}
                  </Link>
                </td>
                <td className="p-2 border-b">{task.assignee}</td>
                <td className="p-2 border-b">{formatDate(task.deadline)}</td>
                <td className="p-2 border-b">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    task.status === 'Pending' ? 'bg-yellow-200 text-yellow-700' :
                    task.status === 'Completed' ? 'bg-green-200 text-green-700' :
                    ''
                  }`}>
                    {task.status}
                  </span>
                </td>
                <td className="p-2 border-b space-x-2">
                  <button
                    onClick={() => openEditTaskModal(task)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteTask(task.id, task.title)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                  {task.subtasks && (
        <div
          className="text-blue-600 hover:underline cursor-pointer mt-2"
          onClick={() => setShowSubtasks(!showSubtasks)}
        >
          Subtasks ({task.subtasks.length}) {showSubtasks ? "▲" : "▼"}
        </div>
      )}
  </td>
  </tr>
      <tr>
        <td colSpan={2} className='text-center'>

        {showSubtasks && task.subtasks && (
        <ul className="ml-4 mt-2 list-disc text-sm text-gray-700">
          {task.subtasks.map((sub) => (
            <li key={sub.id} className={sub.done ? "line-through" : ""}>
              {sub.title}
            </li>
          ))}
        </ul>
      )}
        </td>
      
      </tr>
      
      </>   
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </p>
          <div className="space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded disabled:opacity-50"
            >
              &lt;
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`py-1 px-2 rounded font-bold ${
                  currentPage === page ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded disabled:opacity-50"
            >
              &gt;
            </button>
          </div>
        </div>
      )}

      {/* Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">{editTask ? 'Edit Task' : 'New Task'}</h2>
            <TaskForm
              onSubmit={handleSubmitTask}
              taskToEdit={editTask}
              onCancel={closeTaskModal}
            />
            <button onClick={closeTaskModal} className="mt-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;