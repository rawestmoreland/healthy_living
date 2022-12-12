import { useState } from 'react';

import navigation from '../constants/navigation';

import SidebarDesktop from '../components/SideNav';
import SidebarNavMobile from '../components/SidebarNavMobile';
import SearchHeader from '../components/SearchHeader';

export default function Layout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div className="min-h-full">
        {/* Mobile drawer navbar */}
        <SidebarNavMobile
          navigation={navigation}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />

        {/* Static sidenav for desktop */}
        <SidebarDesktop navigation={navigation} user={user} />

        {/* Main column */}
        <div className="flex flex-col lg:pl-64">
          {/* Search header */}
          <SearchHeader openSidebar={() => setSidebarOpen(true)} user={user} />
          <main className="flex-1">{user ? children : <></>}</main>
        </div>
      </div>
    </>
  );
}
