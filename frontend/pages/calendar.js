import Layout from "../components/Layout"
import Calendar from "../components/Calendar"

import { useSession } from "next-auth/react"

export default function Page() {
  const {data: session} = useSession();
  return <Layout user={session?.user}><Calendar /></Layout>
}