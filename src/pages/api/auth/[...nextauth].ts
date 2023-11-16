import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';


export const authOptions: AuthOptions = {
  providers: [CredentialsProvider({
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
  })],
  jwt: {
    secret: process.env.JWT_SECRET,
  },
  secret: process.env.JWT_SECRET,
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      // @ts-ignore
      session.accessToken = token.accessToken
      return session
    }
  }
}


export default NextAuth(authOptions);
