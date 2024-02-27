import { useStateProvider } from "@/context/StateContext";
import React, { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { calculateTime } from "@/utils/CalculateTime";
import { BsCheckAll, BsCheckLg } from "react-icons/bs";
import MessageStatus from "../common/MessageStatus";
import ImageMessage from "./ImageMessage";

const VoiceMessage = dynamic(() => import("@/components/Chat/VoiceMessage"), {
  ssr: false,
});

export default function ChatContainer() {
  const [{ messages, currentChatUser, userInfo }] = useStateProvider();

  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const lastMessage =
      container.lastElementChild.lastElementChild.lastElementChild
        .lastElementChild;

    if (lastMessage) {
      lastMessage.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div
      className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar "
      ref={containerRef}
    >
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0 ">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={`text-white px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%]	 ${
                      message.senderId === currentChatUser.id
                        ? "bg-incoming-background"
                        : "bg-outgoing-background"
                    }`}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === userInfo.id && (
                          <MessageStatus
                            messageStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "image" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Component Definition:

// export default function ChatContainer() { ... }: This line defines a functional component named ChatContainer and marks it as the default export.
// State and Data:

// const [{ messages, currentChatUser, userInfo }] = useStateProvider();: This line accesses state values (messages, current chat user, user information) from the StateContext using the useStateProvider hook.
// const containerRef = useRef(null);: This line creates a reference to which a DOM element can be attached for later manipulation.
// Scrolling Effect:

// useEffect(() => { ... }, [messages]);: This useEffect runs whenever the messages array changes:
// It gets a reference to the container element.
// It finds the last message element within the container.
// It scrolls the last message into view with smooth scrolling behavior.
// 5. Rendered UI:

// return ( ... );: This line returns the JSX code that defines the visual structure of the component.
// Main Container:

// <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar " ref={containerRef}>: This outer div acts as the primary container for the entire chat display. It has styles for height, width, positioning, scrolling, and a custom scrollbar. The ref attribute assigns it to the containerRef for later access.
// Background and Overlay:

// <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>: This div likely creates a semi-transparent background overlay for the chat.
// Message Container:

// <div className="mx-10 my-6 relative bottom-0 z-40 left-0 "> ... </div>: This div positions and styles the main message container within the chat area.
// Message List:

// <div className="flex w-full"> ... <div className="flex flex-col justify-end w-full gap-1 overflow-auto"> ... </div> </div>: This div creates a flexible container for the message list, arranging messages vertically and aligning them to the end. It also enables overflow scrolling for longer conversations.
// Message Rendering:

// {messages.map((message, index) => ( ... ))}: This map function iterates over the messages array and renders a div for each message.
// Individual Message Layout:

// <div key={index} className={flex ${ ... }}> ... </div>: This div acts as the container for a single message, handling its alignment based on sender ID.
// Message Rendering Based on Type:

// Conditional rendering within the message div:
// Text messages are rendered with a text bubble, timestamp, and message status.
// Image messages are rendered using the ImageMessage component.
// Audio messages are rendered using the `VoiceMessage
