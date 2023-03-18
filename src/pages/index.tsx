import { useState } from "react";
import Head from "next/head";
import axios from "axios";
import TypingAnimation from "@/components/TypingAnimation";

type ChatLog = {
  type: string;
  message: string;
};

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [chatLog, setChatLog] = useState<ChatLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setChatLog((prevChatlog) => [
      ...prevChatlog,
      { type: "user", message: inputValue },
    ]);

    sendMessage(inputValue);

    setInputValue("");
  };

  const sendMessage = (message: string) => {
    const url = "/api/chat";

    const data = {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    };

    setIsLoading(true);

    axios
      .post(url, data)
      .then((response) => {
        setChatLog((prevChatLog) => [
          ...prevChatLog,
          { type: "bot", message: response.data.choices[0].message.content },
        ]);
        setIsLoading(false);
      })
      .catch((error: any) => {
        setIsLoading(false);

        console.log(error);
      });
  };

  return (
    <>
      <Head>
        <title>ChatGPT</title>
        <meta name="description" content="Chat with ChatGPT" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="container mx-auto max-w-[700px] max-h-screen overflow-y-auto">
        <div className="flex flex-col h-screen bg-gray-900">
          <h1 className="bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-center py-3 font-bold text-6xl">
            ChatGPT
          </h1>
          <div className="flex-grow p-6 h-full">
            <div className="flex flex-col sapce-y-4">
              {chatLog.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`${
                      message.type === "user" ? "bg-purple-500" : "bg-gray-800"
                    } rounded-lg p-4 text-white max-w-sm`}
                  >
                    {message.message}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div key={chatLog.length} className="flex justify-start">
                  <div className="bg-gray-800 rounded-lg p-4 text-white max-w-sm">
                    <TypingAnimation />
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex-none p-6">
            <div className="flex rounded-lg border border-gray-700 bg-gray-800">
              <input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-grow px-4 py-2 bg-transparent text-white focus:outline-none"
              />
              <button
                type="submit"
                className="bg-purple-500 rounded-lg px-4 py-2 text-white font-semibold focus:outline-none hover:bg-purple-600 transition-colors duration-300"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
