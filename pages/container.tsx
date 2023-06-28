import { DarkContext } from "@/context/DarkContext";
import { useState, useEffect, useRef, useContext } from "react";
import Image from "next/image";
import TypeWriter from "./typeWriter";
import axios from "axios";

const Container = () => {
  const { darkMode, toggleDarkMode }: any = useContext(DarkContext);

  const scrollContainer = useRef(null);
  const focus = useRef<any>(null);

  const [messageText, setMessageText] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [userChat, setUserChat] = useState<string[]>([]);
  const [botChat, setBotChat] = useState<string[]>([]);
  const [htmlChat, setHtmlChat] = useState<string[]>([]);

  const tagResponse = async (botanswer: string) => {
    setIsLoading(true);
    let botReply2;
    await axios
      .post(
        "https://gpt-answer.vercel.app/api/getData",
        {
          text: `change ${botanswer} using the most suitable html tags, Only show html tags, not the other description.`,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        if (res.data.success) {
          botReply2 = res.data.text.text;
          setHtmlChat([...htmlChat, botReply2]);
        } else {
          console.log("error");
        }
      });
    setIsLoading(false);
  };
  const botResponse = async () => {
    setIsLoading(true);
    await axios
      .post("https://gpt-answer.vercel.app/api/getData", {
        text: messageText,
      })
      .then((res) => {
        if (res.data.success) {
          const botReply1 = res.data.text.text;
          setBotChat([...botChat, botReply1]);
          tagResponse(botReply1);
        } else {
          console.log("error");
        }
      });
  };

  const handleScroll = (ref: any) => {
    ref.scrollTo({
      top: ref.scrollHeight,
      left: 0,
      behavior: "smooth",
    });
  };

  const sendMessage = () => {
    if (isLoading) return;
    if (messageText.trim().length !== 0) {
      botResponse();
    }
    setUserChat(
      messageText.trim().length === 0 ? userChat : [...userChat, messageText]
    );
    setMessageText("");
  };

  const handleEnterKey = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  useEffect(() => {
    if (isLoading === false) {
      focus?.current?.focus();
    }
  }, [isLoading]);

  useEffect(() => {
    handleScroll(scrollContainer.current);
  }, [userChat, botChat]);

  return (
    <div className={`bg-${darkMode}`}>
      <div
        className={`flex gap-8 items-center justify-center h-[10vh] relative header-${darkMode}`}
      >
        <h1
          className={`text-${darkMode} font-bold  text-center py-7 text-[37px]`}
        >
          ChatGPT 3.5 Answer to Html Format
        </h1>
        <div className="absolute right-4" onClick={toggleDarkMode}>
          {darkMode ? (
            <Image
              src="/assets/images/icons/light-sun.png"
              alt="tool"
              width={44}
              height={44}
            />
          ) : (
            <Image
              src="/assets/images/icons/dark-moon.png"
              alt="tool"
              width={33}
              height={33}
            />
          )}
        </div>
      </div>
      <div className={`container-bg-${darkMode}`}>
        <div
          className="container mx-auto px-12 max-sm:px-6 py-6 overflow-auto h-[80vh] chat-container w-[44%]"
          ref={scrollContainer}
        >
          {userChat.map((ele, key) => {
            return (
              <div key={`blockchat-${key}`}>
                <div
                  key={`userchat-${key}`}
                  className="flex flex-col my-[40px] items-end justify-center"
                >
                  <div
                    className={`input-user-chat-bg-${darkMode} input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%] max-lg:max-w-full break-words`}
                  >
                    {ele}
                  </div>
                </div>
                {botChat[key] && (
                  <div
                    key={`botchat-${key}`}
                    className="flex flex-col my-[40px] items-start justify-center break-words"
                  >
                    <div
                      className={`input-bot-chat-bg-${darkMode} input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%] max-lg:max-w-full`}
                    >
                      {botChat[key].split("\n").map((ele: any, indkey: any) => {
                        return <p key={`indkey-${indkey}`}>{ele}</p>;
                      })}
                    </div>
                  </div>
                )}

                {htmlChat[key] && (
                  <div
                    key={`htmlChat-${key}`}
                    className="flex flex-col my-[40px] items-start justify-center break-words"
                  >
                    <div
                      className={`input-bot-chat-bg-${darkMode} input-user-chat-color-${darkMode} rounded-2xl px-6 py-2 max-w-[50%] max-lg:max-w-full`}
                    >
                      {htmlChat[key]
                        .split("\n")
                        .map((ele: any, indkey: any) => {
                          return <p key={`inddkey-${indkey}`}>{ele}</p>;
                        })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {isLoading && (
            <div className="lds-ellipsis">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
        </div>
      </div>
      <div className="container mx-auto px-12 max-sm:px-2 flex justify-center h-[10vh] relative">
        {isLoading ? (
          <div className="relative w-1/2 flex items-center max-sm:py-2 max-xl:w-full flex justify-center max-md:flex-col max-md:items-center gap-4">
            <textarea
              disabled
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyUp={handleEnterKey}
              className={`input-bg-${darkMode}  rounded-full outline-none  border input-border-${darkMode} input-text-${darkMode} w-full h-14 px-6 py-3 resize-none`}
              placeholder="Please type your question here ..."
            />
            <Image
              src="/assets/images/icons/send-message.png"
              width={21}
              height={21}
              className={`absolute right-4 active:translate-y-1`}
              onClick={sendMessage}
              alt=""
            />
          </div>
        ) : (
          <div className="relative w-1/2 flex items-center max-sm:py-2 max-xl:w-full flex justify-center max-md:flex-col max-md:items-center gap-4">
            <textarea
              ref={focus}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyUp={handleEnterKey}
              className={`input-bg-${darkMode}  rounded-full outline-none  border input-border-${darkMode} input-text-${darkMode} w-full h-14 px-6 py-3 resize-none`}
              placeholder="Please type your question here ..."
            />
            <Image
              src="/assets/images/icons/send-message.png"
              width={21}
              height={21}
              className={`absolute right-4 active:translate-y-1`}
              onClick={sendMessage}
              alt=""
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Container;
