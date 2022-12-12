import { useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col gap-4 justify-center items-center">
        <label className="flex flex-col">
          Email
          <input
            aria-label="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label className="flex flex-col">
          Password
          <input
            aria-label="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>

        <button
          className="border border-indigo-600 rounded-md py-2 bg-indigo-600 text-white w-full"
          onClick={() =>
            signIn('credentials', { email, password, callbackUrl: '/' })
          }
        >
          Sign In
        </button>
        <Link
          className="underline hover:text-indigo-500 text-indigo-600"
          href="/signup"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
