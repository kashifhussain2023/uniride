import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions = {
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.user) {
        return {
          ...token,
          user: {
            ...token.user,
            ...session.user,
          },
        };
      }
      if (user) {
        token.user = user;
        token.accessToken = user.token_code;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        try {
          const formData = {
            password: credentials.password,
            phone: credentials.phone,
            phone_code: credentials.phone_code,
          };
          const url = `${process.env.NEW_API_URL}/customer/login`;
          const { data } = await axios.post(url, formData, {
            headers: {
              'Device-Id': '6363',
              'Device-Type': 'android',
            },
          });
          if (data.status) {
            return {
              ...data.data,
              message: data.message,
            };
          }
          throw new Error(data.message || 'Authentication failed');
        } catch (e) {
          throw new Error(e.message || 'Authentication failed');
        }
      },
      credentials: {
        password: {
          label: 'Password',
          type: 'password',
        },
        phone: {
          label: 'Phone',
          type: 'text',
        },
        phone_code: {
          label: 'Phone Code',
          type: 'text',
        },
      },
      name: 'credentials',
    }),
  ],
  session: {
    maxAge: 30 * 24 * 60 * 60,
    strategy: 'jwt',
  },
};

export default NextAuth(authOptions);
