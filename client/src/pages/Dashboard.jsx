import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { getTasks, createTask } from '../services/taskService.js';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', deadline: '', status: 'pending' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to load tasks');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTask(form);
      setForm({ title: '', description: '', deadline: '', status: 'pending' });
      await loadTasks();
      setMessage('Task created');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to create task');
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <h2>Dashboard</h2>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <br />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <br />
          <input
            type="date"
            value={form.deadline}
            onChange={(e) => setForm({ ...form, deadline: e.target.value })}
          />
          <br />
          <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <br />
          <button type="submit">Create Task</button>
        </form>
        {message ? <p>{message}</p> : null}
        <ul>
          {tasks.map((task) => (
            <li key={task._id}>
              <strong>{task.title}</strong> - {task.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
