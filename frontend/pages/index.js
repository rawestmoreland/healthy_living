import { signIn, useSession } from 'next-auth/react';

import Layout from '../components/Layout';
import Calendar from '../components/Calendar';
import TaskForm from '../components/TaskForm';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home({ tasks, taskLogs }) {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div></div>;

  if (status !== 'loading' && !session) signIn();

  return (
    <Layout user={session?.user}>
      <Calendar taskLogs={taskLogs} user={session?.user} />
      <TaskForm tasks={tasks} taskLogs={taskLogs} user={session?.user} />
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (!session) return { props: {} };
  const tasks = await fetch(
    `${process.env.PB_URL}/api/collections/tasks/records`
  ).then((res) => res.json());
  const taskLogs = await fetch(
    `${process.env.PB_URL}/api/collections/task_logs/records?expand=tasks&filter=(user='${session.user.id}')`,
    {
      headers: { Authorization: `Bearer ${session?.jwt}` },
    }
  ).then((res) => res.json());
  return { props: { tasks, taskLogs } };
}
