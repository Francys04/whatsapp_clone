import React from "react";
//  The @ symbol likely represents the project's root directory,
// and the following path specifies the location of the ChatContainer component within the components/Chat folder.
import ChatContainer from "@/components/Chat/ChatContainer";
import ChatHeader from "@/components/Chat/ChatHeader";
import MessageBar from "@/components/Chat/MessageBar";
// This line defines a functional component named Chat and marks it as the default export of the file.
//  This means when another part of the code imports this file, it will automatically access the Chat component.
export default function Chat() {
  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] z-10 ">
      <ChatHeader />
      <ChatContainer />
      <MessageBar />
    </div>
  );
}
