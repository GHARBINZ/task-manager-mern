import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import * as taskService from '../services/taskService.js';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const data = await taskService.getTasks();
        if (active) setTasks(data);
      } catch {
        if (active) setError('Failed to load tasks.');
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const handleCreate = async (payload) => {
    const newTask = await taskService.createTask(payload);
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleDelete = async (id) => {
    const previous = tasks;
    setTasks((prev) => prev.filter((task) => task._id !== id));

    try {
      await taskService.deleteTask(id);
    } catch {
      setError('Failed to delete task.');
      setTasks(previous);
    }
  };

  const handleToggleStatus = async (task) => {
    const updated = await taskService.updateTask(task._id, {
      status: task.status === 'pending' ? 'completed' : 'pending',
    });

    setTasks((prev) => prev.map((item) => (item._id === updated._id ? updated : item)));
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: '700px', margin: '2rem auto' }}>
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>Welcome{user?.name ? `, ${user.name}` : ''}</h2>
          <button onClick={logout}>Log out</button>
        </header>

        <section>
          <h3>Add a Task</h3>
          <TaskForm onCreate={handleCreate} />
        </section>

        <section>
          <h3>Your Tasks</h3>
          {loading && <p>Loading tasks...</p>}
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {!loading && !error && tasks.length === 0 && <p>No tasks yet. Add one above!</p>}

          <ul>
            {tasks.map((task) => (
              <li key={task._id} style={{ marginBottom: '1rem' }}>
                <div>
                  <strong>{task.title}</strong>
                  {task.description ? <p>{task.description}</p> : null}
                  {task.deadline ? <small>Due: {new Date(task.deadline).toLocaleDateString()}</small> : null}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={() => handleToggleStatus(task)}>
                    {task.status === 'pending' ? 'Mark done' : 'Reopen'}
                  </button>
                  <button onClick={() => handleDelete(task._id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
