import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from '../../../services/auth';

export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: 'Credentials',
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if (credentials === null) return null;

        const { record: user, token: jwt } = await signIn({
          email: credentials.email,
          password: credentials.password,
        });
        if (user) {
          return { ...user, jwt };
        } else return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.id = token.id;
      session.jwt = token.jwt;
      session.user = token.user;
      return Promise.resolve(session);
    },
    async jwt({ token, user }) {
      // Persist the OAuth access_token to the token right after signin
      const isSignIn = user ? true : false;
      if (isSignIn) {
        token.id = user.id;
        token.jwt = user.jwt;
        token.user = user;
      }
      return Promise.resolve(token);
    },
  },
};

export default NextAuth(authOptions);
