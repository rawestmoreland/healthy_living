import { useState } from 'react';

import { signIn } from 'next-auth/react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [name, setName] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const createAccount = async () => {
    setSubmitting(true);
    const response = await fetch(`api/pocketbase/collections/users/records/`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        email,
        name,
        password,
        passwordConfirm: confirmPassword,
      }),
    });
    if (response.status < 300) {
      setSubmitted(true);
      setSubmitting(false);
      setPassword('');
      setEmail('');
      setName('');
      setConfirmPassword('');
    }
    setSubmitting(false);
  };

  return (
    <div className="flex justify-center items-center w-screen h-screen">
      <div className="flex flex-col gap-4 justify-center items-center">
        <label className="flex flex-col">
          Email
          <input
            disabled={submitting || submitted}
            aria-label="email"
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </label>
        <label className="flex flex-col">
          Name
          <input
            disabled={submitting || submitted}
            aria-label="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </label>
        <label className="flex flex-col">
          Password
          <input
            disabled={submitting || submitted}
            aria-label="password"
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </label>
        <label className="flex flex-col">
          Confirm Password
          <input
            disabled={submitting || submitted}
            aria-label="confirm password"
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
          />
        </label>
        <button
          disabled={submitting || submitted}
          className="border border-indigo-600 rounded-md py-2 bg-indigo-600 text-white w-full"
          onClick={() => {
            if (
              email &&
              password &&
              confirmPassword &&
              password === confirmPassword
            )
              createAccount();
          }}
        >
          Sign Up
        </button>
        {submitted && (
          <div className="flex flex-col items-center gap-8 bg-green-300 text-white p-8 rounded">
            Check your email (might go to spam) and click the verify link
            <Link
              className="text-indigo-600 underline cursor-pointer"
              href="/login"
            >
              Log In
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
