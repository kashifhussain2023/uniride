import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";

export const authOptions = {
  site: process.env.NEXTAUTH_URL,
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email address", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          // const formData = new FormData();
          // formData.append(
          //   "device_id",
          //   "8091fd16cfaf9978ba777dbdbb7e92c7684da353d9d7f42b6aad6e5f17947829"
          // );
          // formData.append("os", 1);
          // formData.append("app", "customer");
          // formData.append("email", credentials.email);
          // formData.append("password", credentials.password);

          const formData = {
            phone: credentials.phone,
            password: credentials.password,
            phone_code: credentials.phone_code,

          };

          // const url = `${process.env.NEXT_PUBLIC_API_URL}/customers/main_login`;
          const url = `https://uniridedev.24livehost.com/api/v2/customer/login`;
          console.log("url", url);

          const { data } = await axios.post(url, formData, {
            headers: {
              'Device-Type': 'android',
              'Device-Id': '6363'
            }
          });

          console.log("data", data);

          if (data.status) return data;
          else throw new Error(data.message);
        } catch (e) {
          throw new Error(e.message);
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token, trigger, session }) => {
      if (trigger === "update") {
        const { customer_image, name, token_code, profile_status } =
          session.user || {};
        if (customer_image) {
          token.user.customer_image = customer_image;
        }
        if (name) {
          token.user.name = name;
        }
        if (token_code) {
          token.user.token_code = token_code;
        }
        if (profile_status) {
          token.user.profile_status = profile_status;
        }

        return token;
      }
      if (user) {
        token.user = { ...user };
      }

      return token;
    },
    redirect: async ({ url, baseUrl }) => {
      if (url.startsWith("/")) {
        return new URL(url, baseUrl).toString();
      } else if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
    session: async ({ session, token }) => {
      const newSession = { ...session };
      if (token.user) {
        newSession.user = token.user;
      }

      return newSession;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 12 * 60 * 60, //12 hours
  },
  jwt: {
    secret: process.env.NEXT_PUBLIC_NEXTAUTH_SECRET,
    maxAge: 12 * 60 * 60, //12 hours
  },
};

export default NextAuth(authOptions);
