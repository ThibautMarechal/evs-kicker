import NextAuth from 'next-auth';
import CredentialsProvider, { CredentialsConfig } from 'next-auth/providers/credentials';

const provider = CredentialsProvider({
  name: 'Credentials',
  credentials: {
    password: { label: 'Password', type: 'password' },
  },
  authorize: (credentials) => {
    if (credentials?.password === process.env.PASSWORD) {
      return {
        id: 'kicker-user',
      };
    }
    return null;
  },
});

export default NextAuth({
  providers: [provider as CredentialsConfig<any>],
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.JWT_SECRET,
});
