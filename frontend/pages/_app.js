import { SessionProvider } from 'next-auth/react';
import DateContext from '../contexts/DateContext';
import dayjs from 'dayjs';

import '../styles/globals.css';
import { useState } from 'react';

const todayObj = dayjs();

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [selectedDay, setSelectedDay] = useState(todayObj);
  return (
    <SessionProvider session={session}>
      <DateContext.Provider value={{ setSelectedDay, selectedDay }}>
        <Component {...pageProps} />
      </DateContext.Provider>
    </SessionProvider>
  );
}

export default MyApp;
