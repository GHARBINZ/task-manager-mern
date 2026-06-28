import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const Register = () => {
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  });

  const password = watch('password');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async ({ name, email, password }) => {
    try {
      await registerUser(name, email, password);
      navigate('/', { replace: true });
    } catch (err) {
      setError('root', {
        message: err.response?.data?.message || 'Registration failed. Please try again.',
      });
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit(onSubmit)}>
        <h1>Create account</h1>

        {errors.root && <p className="error">{errors.root.message}</p>}

        <div className="field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

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
            autoComplete="new-password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 8, message: 'Password must be at least 8 characters' },
            })}
          />
          {errors.password && <span className="error">{errors.password.message}</span>}
        </div>

        <div className="field">
          <label htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) => value === password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && <span className="error">{errors.confirmPassword.message}</span>}
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account...' : 'Register'}
        </button>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
