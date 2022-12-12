import Layout from '../components/Layout';
import { useSession } from 'next-auth/react';

export default function Page() {
  const { data: session } = useSession();
  return (
    <Layout user={session?.user}>
      <div>leaderboard</div>
    </Layout>
  );
}
