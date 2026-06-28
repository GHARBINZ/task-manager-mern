import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ defaultValues: { email: '', password: '' } });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      setError('root', {
        message: err.response?.data?.message || 'Login failed. Please try again.',
      });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Log in</h1>

        {errors.root && <p className="error">{errors.root.message}</p>}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
            })}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password', { required: 'Password is required' })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Logging in...' : 'Log in'}
        </button>

        <p className="auth-switch">
          No account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
