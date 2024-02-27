import { useStateProvider } from "@/context/StateContext";
import { HOST } from "@/utils/ApiRoutes";
import { calculateTime } from "@/utils/CalculateTime";
import Image from "next/image";
import React from "react";
import MessageStatus from "../common/MessageStatus";
// useStateProvider: Imports a custom hook for accessing state from a context, likely containing user and chat information.
// HOST: Imports a constant containing the host URL for API routes, used for constructing image URLs.
// calculateTime: Imports a utility function for formatting timestamps for display.
// Image: Imports the Image component from Next.js for optimized image handling.
// React: Imports the React library for creating components.
// MessageStatus: Imports a custom component likely for displaying message status indicators

//  Defines a functional component named ImageMessage that receives a message prop, expected to contain image message details.
function ImageMessage({ message }) {
  const [{ currentChatUser, userInfo }] = useStateProvider();
  return (
    <div
      className={`p-1 rounded-lg ${
        message.senderId === currentChatUser.id
          ? "bg-incoming-background"
          : "bg-outgoing-background"
      }`}
    >
      <div className="relative">
        <Image
          src={`${HOST}/${message.message}`}
          className="rounded-lg"
          alt="asset"
          height={300}
          width={300}
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
          <span className="text-bubble-meta text-[11px] pt-1 min-w-fit">
            {calculateTime(message.createdAt)}
          </span>
          <span className="text-bubble-meta">
            {message.senderId === userInfo.id && (
              <MessageStatus messageStatus={message.messageStatus} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

export default ImageMessage;
