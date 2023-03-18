import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import HttpsProxyAgent from "https-proxy-agent/dist/agent";

const httpsAgent = new HttpsProxyAgent(process.env.HTTP_PROXY!);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(405).json({ message: "Method must be POST" });
  } else {
    const { body } = req;
    const url = "https://api.openai.com/v1/chat/completions";

    try {
      const response = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        proxy: false,
        httpsAgent: httpsAgent,
      });

      res.status(200).json(response.data);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
}
