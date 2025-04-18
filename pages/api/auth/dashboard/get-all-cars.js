import { getServerSession } from "next-auth/next";
import { authOptions } from 'pages/api/auth/[...nextauth]'
import axios from "axios";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const session = await getServerSession(req, res, authOptions);
      const { user: { token }} = session;
      
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/common/get_cars`,
        req.body,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      res.status(response.status).json(response.data);
      res.end();
    } catch (err) {
      if (err.response) {
        res.status(err.response.status).json(err.response);
        res.end();
      }
    }
  } else {
    res.status(405);
    res.end();
  }
}
