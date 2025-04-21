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

          console.log("data", data);

          if (data.status) {
            // Return the complete user object
            return {
              ...data,
              token_code: data.data.token_code // Ensure token is available for session
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
        // Handle session updates
        return { ...token, user: { ...token.user, ...session.user } };
      }

      if (user) {
        // Initial sign in
        token.user = user;
        token.accessToken = user.data?.token_code;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
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
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions);
