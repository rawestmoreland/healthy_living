import Layout from '../components/Layout';
import { unstable_getServerSession } from 'next-auth';
import { useSession } from 'next-auth/react';
import { authOptions } from './api/auth/[...nextauth]';

export default function Page({ leaderboard }) {
  const { data: session } = useSession();
  return (
    <Layout user={session?.user}>
      <div className="flex flex-col w-full h-screen justify-center items-center">
        <h1 className="text-3xl">Leaderboard</h1>
        <ol>
          {leaderboard.map((person) => (
            <li className="text-center">{person.name}</li>
          ))}
        </ol>
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
  const leaderboard = people.items
    .reduce((result, person) => {
      const personTasks = taskLogs.items.filter(
        (log) => log.user === person.id
      );
      const personScore = personTasks.reduce(
        (score, task) => (score = score + task.tasks.length),
        0
      );
      result.push({
        name: person.name === '' ? person.email : person.name,
        score: personScore,
      });
      return result;
    }, [])
    .sort((a, b) => b.score - a.score);
  return { props: { leaderboard } };
}
