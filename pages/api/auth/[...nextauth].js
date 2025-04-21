import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        phone: { label: "Phone", type: "text" },
        password: { label: "Password", type: "password" },
        phone_code: { label: "Phone Code", type: "text" },
      },
      authorize: async (credentials) => {
        try {
          const formData = {
            phone: credentials.phone,
            password: credentials.password,
            phone_code: credentials.phone_code,
          };

          const url = `${process.env.NEXT_PUBLIC_NEW_API_URL}/customer/login`;

          const { data } = await axios.post(url, formData, {
            headers: {
              'Device-Type': 'android',
              'Device-Id': '6363'
            }
          });

          if (data.status) {
            return {
              ...data,
              token_code: data.data.token_code 
            };
          }
          throw new Error(data.message || "Authentication failed");
        } catch (e) {
          throw new Error(e.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (trigger === "update" && session?.user) {
        return { ...token, user: { ...token.user, ...session.user } };
      }

      if (user) {
        token.user = user;
        token.accessToken = user.data?.token_code;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions);
