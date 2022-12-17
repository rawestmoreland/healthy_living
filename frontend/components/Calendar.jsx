import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import dayjs from 'dayjs';
import isToday from 'dayjs/plugin/isToday';
import range from 'lodash/range';

import { weekDays } from '../constants/calendar';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import DateContext from '../contexts/DateContext';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const todayObj = dayjs();

export default function Calendar({ user, taskLogs }) {
  dayjs.extend(isToday);
  const router = useRouter();
  const [dayObj, setDayObj] = useState(dayjs());
  const [allDays, setAllDays] = useState([]);
  const { selectedDay, setSelectedDay } = useContext(DateContext);

  const thisYear = dayObj.year();
  const thisMonth = dayObj.month(); // (January as 0, December as 11)
  const daysInMonth = dayObj.daysInMonth();

  // The first day of the current month
  const dayObjOf1 = dayjs(`${thisYear}-${thisMonth + 1}-1`);
  // The first weekday of the urrent month
  const weekDayOf1 = dayObjOf1.day(); // (Sunday as 0, Saturday as 6)

  // The last day of the current month
  const dayObjOfLast = dayjs(`${thisYear}-${thisMonth + 1}-${daysInMonth}`);
  // The last weekday of the the current month
  const weekDayOfLast = dayObjOfLast.day();

  const handlePrev = () => {
    const prevMonth = dayObj.subtract(1, 'month');
    if (prevMonth.isAfter(dayjs('2022-11-30'))) {
      setDayObj(prevMonth);
    }
  };

  const handleNext = () => {
    const nextMonth = dayObj.add(1, 'month');
    if (nextMonth.isBefore('2023-04-01')) {
      setDayObj(nextMonth);
    }
  };

  const getAllDays = () => {
    let allDays = [];
    range(weekDayOf1).map((i) => {
      const iDate = dayObjOf1.subtract(weekDayOf1 - i, 'day');
      allDays.push({
        date: iDate.format('YYYY-MM-DD'),
        ...(thisMonth === iDate.month() && {
          isCurrentMonth: thisMonth === iDate.month(),
        }),
        ...(iDate.isToday() && { isToday: iDate.isToday() }),
        ...(iDate === selectedDay && { isSelected: iDate === selectedDay }),
      });
    });
    range(daysInMonth).map((i) => {
      const iDate = dayjs(`${dayObj.year()}-${dayObj.month() + 1}-${i + 1}`);
      allDays.push({
        date: dayObj.format(`${dayObj.year()}-${dayObj.month() + 1}-${i + 1}`),
        ...(thisMonth === dayObj.month() && {
          isCurrentMonth: true,
        }),
        ...(i + 1 === todayObj.date() &&
          dayObj.month() === todayObj.month() && { isToday: true }),
        ...(iDate.format('YYYY-MM-DD') === selectedDay.format('YYYY-MM-DD') && {
          isSelected: true,
        }),
      });
    });
    range(6 - weekDayOfLast).map((i) => {
      const iDate = dayObjOfLast.add(i + 1, 'day');
      allDays.push({
        date: iDate.format('YYYY-MM-DD'),
        ...(thisMonth === iDate.month() && {
          isCurrentMonth: thisMonth === iDate.month(),
        }),
        ...(iDate.isToday() && { isToday: iDate.isToday() }),
      });
    });
    setAllDays(allDays);
  };

  /**
   * When the user selects a new day, insert a record in task_logs.
   * Only create recrords for December 2022 - end of March 2023
   */
  const handleChangeDay = async (date) => {
    if (
      !taskLogs.items.some((log) =>
        dayjs(log.date).utc().isSame(date.utc().startOf('day'), 'day')
      )
    ) {
      const response = await fetch(
        `/api/pocketbase/collections/task_logs/records?filter=(user='${user.id}')`,
        {
          method: 'POST',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify({
            user: user.id,
            date: dayjs(date).format('YYYY-MM-DD'),
            tasks: [],
          }),
        }
      );
      if (response.status === 200) {
        router.replace(router.asPath);
      }
    }
    setSelectedDay(date);
  };

  useEffect(() => {
    getAllDays();
  }, [dayObj, selectedDay]);

  return (
    <>
      <div className="flex flex-col justify-center mt-8 mx-8">
        <div className="flex items-center">
          <h2 className="flex-auto font-semibold text-gray-900">
            {dayObj.format('MMMM YYYY')}
          </h2>
          <button
            type="button"
            className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={handlePrev}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
            onClick={handleNext}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-10 grid grid-cols-7 text-center text-xs leading-6 text-gray-500">
          {weekDays.map((d) => (
            <div key={`weekday-${d}`}>{d}</div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-7 text-sm">
          {allDays?.map((day, dayIdx) => (
            <div
              key={day.date}
              className={classNames(
                dayIdx > 6 && 'border-t border-gray-200',
                'py-2'
              )}
            >
              <button
                type="button"
                disabled={
                  dayjs(day.date).isBefore(dayjs('2022-12-01')) ||
                  dayjs(day.date).isAfter(dayjs('2023-03-31'))
                }
                className={classNames(
                  day.isSelected && 'text-white',
                  !day.isSelected && day.isToday && 'text-indigo-600',
                  !day.isSelected &&
                    !day.isToday &&
                    day.isCurrentMonth &&
                    'text-gray-900',
                  !day.isSelected &&
                    !day.isToday &&
                    !day.isCurrentMonth &&
                    'text-gray-400',
                  day.isSelected && day.isToday && 'bg-indigo-600',
                  day.isSelected && !day.isToday && 'bg-gray-900',
                  !day.isSelected && 'hover:bg-gray-200',
                  (day.isSelected || day.isToday) && 'font-semibold',
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full'
                )}
                onClick={() => {
                  handleChangeDay(dayjs(day.date));
                }}
              >
                <time dateTime={day.date}>
                  {day.date.split('-').pop().replace(/^0/, '')}
                </time>
              </button>
            </div>
          ))}
        </div>
        {/* <section className="mt-12">
      <h2 className="font-semibold text-gray-900">
        Schedule for <time dateTime="2022-01-21">January 21, 2022</time>
      </h2>
      <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
        {meetings.map((meeting) => (
          <li
            key={meeting.id}
            className="group flex items-center space-x-4 rounded-xl py-2 px-4 focus-within:bg-gray-100 hover:bg-gray-100"
          >
            <img src={meeting.imageUrl} alt="" className="h-10 w-10 flex-none rounded-full" />
            <div className="flex-auto">
              <p className="text-gray-900">{meeting.name}</p>
              <p className="mt-0.5">
                <time dateTime={meeting.startDatetime}>{meeting.start}</time> -{' '}
                <time dateTime={meeting.endDatetime}>{meeting.end}</time>
              </p>
            </div>
            <Menu as="div" className="relative opacity-0 focus-within:opacity-100 group-hover:opacity-100">
              <div>
                <Menu.Button className="-m-2 flex items-center rounded-full p-1.5 text-gray-500 hover:text-gray-600">
                  <span className="sr-only">Open options</span>
                  <EllipsisVerticalIcon className="h-6 w-6" aria-hidden="true" />
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
                <Menu.Items className="absolute right-0 z-10 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Edit
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <a
                          href="#"
                          className={classNames(
                            active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                            'block px-4 py-2 text-sm'
                          )}
                        >
                          Cancel
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </li>
        ))}
      </ol>
    </section> */}
      </div>
    </>
  );
}
