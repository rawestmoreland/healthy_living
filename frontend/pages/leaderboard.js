import Layout from '../components/Layout';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

export default function Page({ leaderboard, tasks }) {
  const { data: session } = useSession();
  return (
    <Layout user={session?.user}>
      <div className="flex flex-col w-full h-screen justify-center items-center">
        <h1 className="text-3xl">Leaderboard</h1>
        <ol className="mb-8">
          {Object.entries(leaderboard)
            .sort((a, b) => b[1].totalScore - a[1].totalScore)
            .map((entry, index) => {
              return (
                <li key={`${entry[1].name}-${index}`} className="text-center">
                  {entry[1].name} - <strong>{entry[1].totalScore}</strong>
                </li>
              );
            })}
        </ol>
        <div className="grid grid-cols-1 gap-8 mt-4">
          {tasks.map((task) => (
            <div>
              <h2 key={task.id} className="text-center mb-2 text-lg font-bold">
                {task.title}
              </h2>
              <ul>
                {Object.entries(leaderboard).map((entry, index) => {
                  return (
                    <li
                      className="text-center"
                      key={`category-${task.id}-${entry[1].name}`}
                    >
                      {entry[1].name} -{' '}
                      <strong>{entry[1].categories[task.id]}</strong>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const accessToken = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!accessToken) return { props: {} };
  const tasks = await fetch(
    `${process.env.PB_URL}/api/collections/tasks/records`
  ).then((res) => res.json());
  const people = await fetch(
    `${process.env.PB_URL}/api/collections/users/records`,
    {
      headers: {
        Authorization: `Bearer ${accessToken?.jwt}`,
      },
    }
  ).then((res) => res.json());
  const taskLogs = await fetch(
    `${process.env.PB_URL}/api/collections/task_logs/records?expand=tasks`,
    {
      headers: { Authorization: `Bearer ${accessToken?.jwt}` },
    }
  ).then((res) => res.json());
  const leaderboard = people.items.reduce((result, person) => {
    const personTasks = taskLogs.items.filter((log) => log.user === person.id);
    const personScore = personTasks.reduce(
      (score, task) => (score = score + task.tasks.length),
      0
    );

    result[person.id] = {
      name: person.name === '' ? person.email : person.name,
      totalScore: personScore,
      categories: {},
    };
    return result;
  }, {});
  tasks.items.forEach((task) => {
    Object.keys(leaderboard).forEach((user) => {
      leaderboard[user]['categories'][task.id] = taskLogs.items.filter(
        (log) => log.user === user && log.tasks.includes(task.id)
      ).length;
    });
  });
  return { props: { leaderboard, tasks: tasks.items } };
}
