import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useContext, useEffect, useState } from 'react';
import DateContext from '../contexts/DateContext';

export default function TaskForm({ tasks, user }) {
  dayjs.extend(utc);
  const { selectedDay } = useContext(DateContext);
  const [submitting, setSubmitting] = useState(false);
  const [dayLog, setDayLog] = useState();

  // const dayLog = taskLogs.items.filter((log) =>
  //   dayjs(log.date).utc().isSame(selectedDay.utc().startOf('day'), 'day')
  // )[0];

  const createNewLog = async () => {
    return await fetch(`/api/pocketbase/collections/task_logs/records`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        user: user.id,
        date: selectedDay.utc().startOf('day').format('YYYY-MM-DD'),
        tasks: null,
      }),
    })
      .then((res) => res.json())
      .then(({ data }) => data);
  };

  const onUpdateTask = async (event) => {
    setSubmitting(true);
    console.log(dayLog);
    let newLog = [];

    if (!dayLog) {
      newLog = await createNewLog();
    } else newLog = dayLog;

    let newTasks = newLog.tasks;
    const index = newLog.tasks.findIndex((task) => task === event.target.name);
    console.log({ index });
    if (index === -1) {
      newTasks.push(event.target.name);
    } else {
      newTasks.splice(index, 1);
    }
    const response = await fetch(
      `/api/pocketbase/collections/task_logs/records/${newLog.id}`,
      {
        method: 'PATCH',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          tasks: newTasks,
        }),
      }
    );
    if (response.status < 300) {
      const responseData = await response.json();
      setDayLog(responseData.data);
    }
    setSubmitting(false);
  };

  useEffect(() => {
    async function getDayLog() {
      await fetch(
        `/api/pocketbase/collections/task_logs/records?filter=(user='${user.id}')`
      )
        .then((res) => res.json())
        .then(({ data }) => {
          setDayLog(
            data.items.filter((item) =>
              dayjs(item.date)
                .utc()
                .isSame(selectedDay.utc().startOf('day'), 'day')
            )[0]
          );
        });
    }
    getDayLog();
    console.log('butts');
  }, [selectedDay]);
  return (
    <div className="mx-8 md:mt-16 mt-8 w-full max-w-lg">
      <h2 className="text-lg font-bold">
        Tasks for {selectedDay.format('MMMM DD, YYYY')}
      </h2>
      <fieldset className="space-y-5">
        <legend className="sr-only">Tasks</legend>
        {tasks.items.map((task) => {
          return (
            <div key={`task-${task.id}`} className="relative flex items-start">
              <div className="flex h-5 items-center">
                <input
                  disabled={submitting}
                  id={task.id}
                  aria-describedby={`${task.title}-description`}
                  checked={dayLog?.tasks.some((t) => t === task.id)}
                  name={task.id}
                  type="checkbox"
                  className={`h-4 w-4 rounded border-gray-300 ${
                    submitting ? 'text-gray-400' : 'text-indigo-600'
                  } focus:ring-indigo-500`}
                  onChange={onUpdateTask}
                />
              </div>
              <div className="ml-3 text-sm">
                <label
                  htmlFor="candidates"
                  className="font-medium text-gray-700"
                >
                  {task.title}
                </label>
              </div>
            </div>
          );
        })}
      </fieldset>
    </div>
  );
}
