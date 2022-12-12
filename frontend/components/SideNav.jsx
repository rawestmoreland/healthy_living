import { Fragment } from 'react';

import { signOut, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Menu, Transition } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import { getPocketbaseMedia } from '../services/media';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function SidebarDesktop({ navigation, user }) {
  const router = useRouter();
  return (
    <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col lg:border-r lg:border-gray-200 lg:bg-gray-100 lg:pt-5 lg:pb-4">
      <div className="flex flex-shrink-0 items-center px-6">
        <img
          className="h-8 w-auto"
          src="https://tailwindui.com/img/logos/mark.svg?color=purple&shade=500"
          alt="Your Company"
        />
      </div>
      {/* Sidebar component, swap this element with another sidebar if you like */}
      <div className="mt-5 flex h-0 flex-1 flex-col overflow-y-auto pt-1">
        {/* User account dropdown */}
        {user && (
          <Menu as="div" className="relative inline-block px-3 text-left">
            <div>
              <Menu.Button className="group w-full rounded-md bg-gray-100 px-3.5 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-100">
                <span className="flex w-full items-center justify-between">
                  <span className="flex min-w-0 items-center justify-between space-x-3">
                    <Image
                      alt=""
                      src={getPocketbaseMedia(user.id, user.avatar)}
                      height={40}
                      width={40}
                    />
                    <span className="flex min-w-0 flex-1 flex-col">
                      <span className="truncate text-sm font-medium text-gray-900">
                        {user.name}
                      </span>
                      <span className="truncate text-sm text-gray-500">
                        {user.email}
                      </span>
                    </span>
                  </span>
                  <ChevronUpDownIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                </span>
              </Menu.Button>
            </div>
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 left-0 z-10 mx-3 mt-1 origin-top divide-y divide-gray-200 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <a
                        onClick={() => signOut()}
                        className={classNames(
                          active
                            ? 'bg-gray-100 text-gray-900'
                            : 'text-gray-700',
                          'block px-4 py-2 text-sm'
                        )}
                      >
                        Logout
                      </a>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        )}

        {/* Sidebar Search */}
        {/* <div className="mt-5 px-3">
          <label htmlFor="search" className="sr-only">
            Search
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
              aria-hidden="true"
            >
              <MagnifyingGlassIcon
                className="mr-3 h-4 w-4 text-gray-400"
                aria-hidden="true"
              />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border-gray-300 pl-9 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Search"
            />
          </div>
        </div> */}
        {/* Navigation */}
        <nav className="mt-6 px-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              item.current = router.asPath === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={classNames(
                    item.current
                      ? 'bg-gray-200 text-gray-900'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <item.icon
                    className={classNames(
                      item.current
                        ? 'text-gray-500'
                        : 'text-gray-400 group-hover:text-gray-500',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              );
            })}
          </div>
          {!user && (
            <button
              className="border border-gray-500 bg-indigo-600 text-white rounded-md py-2 px-4 mt-4"
              onClick={() => signIn()}
            >
              {'Sign In'}
            </button>
          )}
        </nav>
      </div>
    </div>
  );
}
