import { useForm } from 'react-hook-form';

const TaskForm = ({ onCreate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { title: '', description: '', deadline: '', status: 'pending' },
  });

  const onSubmit = async (values) => {
    const payload = {
      title: values.title,
      description: values.description || undefined,
      deadline: values.deadline || undefined,
      status: values.status,
    };

    await onCreate(payload);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="task-form">
      <div>
        <input
          placeholder="Task title"
          {...register('title', {
            required: 'Title is required',
            maxLength: { value: 120, message: 'Max 120 characters' },
          })}
        />
        {errors.title && <span className="error">{errors.title.message}</span>}
      </div>

      <div>
        <textarea placeholder="Description (optional)" {...register('description')} />
      </div>

      <div>
        <input type="date" {...register('deadline')} />
      </div>

      <div>
        <select {...register('status')}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Adding...' : 'Add Task'}
      </button>
    </form>
  );
};

export default TaskForm;
