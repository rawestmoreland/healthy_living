import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useRouter } from 'next/router';
import { useContext, useState } from 'react';
import DateContext from '../contexts/DateContext';

export default function TaskForm({ tasks, taskLogs, user }) {
  dayjs.extend(utc);
  const router = useRouter();
  const { selectedDay } = useContext(DateContext);
  const [submitting, setSubmitting] = useState(false);
  const logs = taskLogs.items.filter((log) =>
    dayjs(log.date).utc().isSame(selectedDay.utc().startOf('day'), 'day')
  );
  const onUpdateTask = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    const newTasks = logs[0]?.tasks || [];
    const taskId = event.target.name;
    const index = newTasks.findIndex((task) => taskId === task);
    if (index === -1) {
      newTasks.push(taskId);
    } else {
      newTasks.splice(index, 1);
    }

    let newLog = null;

    // Create a log entry if there's not one for this day
    if (!logs[0]?.id) {
      await fetch(`/api/pocketbase/collections/task_logs/records`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          user: user.id,
          date: dayjs(selectedDay).format('YYYY-MM-DD'),
          tasks: [],
        }),
      });
      const response = await fetch(
        `/api/pocketbase/collections/task_logs/records`
      );

      const responseData = await response.json();

      console.log(responseData);

      newLog = responseData.data.items[0];
    }

    const response = await fetch(
      `/api/pocketbase/collections/task_logs/records/${
        logs[0]?.id || newLog.id
      }`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          user: user.id,
          date: dayjs(selectedDay).format('YYYY-MM-DD'),
          tasks: newTasks,
        }),
      }
    );
    if (response.status < 300) {
      setSubmitting(false);
      router.replace(router.asPath);
    }
    setSubmitting(false);
  };
  return (
    <div className="mx-8 mt-16 w-full max-w-lg">
      <h2 className="text-lg font-bold">
        Tasks for {selectedDay.format('MMMM DD, YYYY')}
      </h2>
      <fieldset className="space-y-5">
        <legend className="sr-only">Tasks</legend>
        {tasks.items.map((task) => (
          <div className="relative flex items-start">
            <div className="flex h-5 items-center">
              <input
                disabled={submitting}
                id={task.id}
                aria-describedby={`${task.title}-description`}
                checked={logs[0]?.tasks.some((t) => t === task.id)}
                name={task.id}
                type="checkbox"
                className={`h-4 w-4 rounded border-gray-300 ${
                  submitting ? 'text-gray-400' : 'text-indigo-600'
                } focus:ring-indigo-500`}
                onChange={(event) => onUpdateTask(event)}
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="candidates" className="font-medium text-gray-700">
                {task.title}
              </label>
            </div>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
