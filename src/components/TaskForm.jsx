import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskForm = ({ onSubmit, taskToEdit, onCancelEdit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'Low',
    deadline: '',
    status: 'Pending',
    subtasks: [],
  });

  const [subtaskInput, setSubtaskInput] = useState('');
  const [subtaskCounter, setSubtaskCounter] = useState(1);

  const logActivity = async (action, taskTitle) => {
    try {
      await axios.post('http://localhost:3001/logs', {
        action,
        taskTitle,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Log activity failed:', error);
    }
  };

  useEffect(() => {
    if (taskToEdit) {
      setFormData(taskToEdit);
      setSubtaskCounter((taskToEdit.subtasks?.length || 0) + 1);
    }
  }, [taskToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubtaskAdd = () => {
    if (subtaskInput.trim()) {
      const newSubtask = {
        id: `sub-${Date.now()}-${subtaskCounter}`,
        title: subtaskInput.trim(),
        done: false,
      };
      setFormData((prev) => ({
        ...prev,
        subtasks: [...prev.subtasks, newSubtask],
      }));
      logActivity('added subtask', newSubtask.title);
      setSubtaskInput('');
      setSubtaskCounter((prev) => prev + 1);
    }
  };

  const handleSubtaskDelete = (id) => {
    const deletedSub = formData.subtasks.find(sub => sub.id === id);
    setFormData((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((sub) => sub.id !== id),
    }));
    if (deletedSub) logActivity('deleted subtask', deletedSub.title);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const action = taskToEdit ? 'updated task' : 'created task';
    logActivity(action, formData.title);
    onSubmit(formData);

    setFormData({
      title: '',
      description: '',
      assignee: '',
      priority: 'Low',
      deadline: '',
      status: 'Pending',
      subtasks: [],
    });
    setSubtaskInput('');
    setSubtaskCounter(1);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow p-4 rounded space-y-4">
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        className="w-full border p-2"
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <input
        type="text"
        name="assignee"
        placeholder="Assignee"
        value={formData.assignee}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <select
        name="priority"
        value={formData.priority}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <input
        type="date"
        name="deadline"
        value={formData.deadline}
        onChange={handleChange}
        className="w-full border p-2"
      />
      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="w-full border p-2"
      >
        <option>Pending</option>
        <option>Completed</option>
      </select>

      {/* Subtasks Section */}
      <div>
        <h4 className="font-semibold mb-2">Subtasks</h4>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={subtaskInput}
            onChange={(e) => setSubtaskInput(e.target.value)}
            placeholder="New subtask"
            className="flex-1 border p-2"
          />
          <button
            type="button"
            onClick={handleSubtaskAdd}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Add
          </button>
        </div>
        <ul className="space-y-1">
          {formData.subtasks?.map((sub) => (
            <li key={sub.id} className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{sub.title}</span>
              <button
                type="button"
                onClick={() => handleSubtaskDelete(sub.id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
          {taskToEdit ? 'Update Task' : 'Create Task'}
        </button>
        {taskToEdit && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;
