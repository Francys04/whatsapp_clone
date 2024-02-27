// Firebase & React Libraries: Imports necessary libraries for authentication, state management, and UI rendering.
// Socket.io: Imports io from socket.io-client for socket communication.
// Custom Components: Imports various custom components used within Main.
// Utils: Imports useStateProvider for accessing shared state, reducerCases for state update constants,
// axios for making HTTP requests, and API route definitions.

import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import Chat from "@/components/Chat/Chat";
import ChatList from "@/components/Chatlist/ChatList";
import { firebaseAuth } from "../utils/FirebaseConfig";
import { useRouter } from "next/router";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import axios from "axios";
import { CHECK_USER_ROUTE, GET_MESSAGES_ROUTE, HOST } from "@/utils/ApiRoutes";
import Empty from "./Empty";
import Container from "./Call/Container";
import VideoCall from "./Call/VideoCall";
import VoiceCall from "./Call/VoiceCall";
import IncomingCall from "./common/IncomingCall";
import IncomingVideoCall from "./common/IncomingVideoCall";
import SearchMessages from "./Chat/SearchMessages";

// useStateProvider: Destructures state and dispatch function from the context provider.
// useRouter: Gets access to the routing functionality.
// socket: Uses a ref to hold the socket instance.
// redirectLogin: State variable to handle login redirection.
// socketEvent: State variable to track socket event handling.
export default function Main() {
  const [
    {
      userInfo,
      currentChatUser,
      videoCall,
      voiceCall,
      incomingVoiceCall,
      incomingVideoCall,
      messageSearch,
      userContacts,
    },
    dispatch,
  ] = useStateProvider();
  const router = useRouter();
  const socket = useRef();
  const [redirectLogin, setRedirectLogin] = useState(false);
  const [socketEvent, setSocketEvent] = useState(false);
  useEffect(() => {
    if (redirectLogin) router.push("/login");
  }, [redirectLogin]);

  //   Listens for authentication state changes using onAuthStateChanged.
  // If no user is logged in (!currentUser), sets redirectLogin to true.
  // If user info is not yet retrieved and a user is logged in:
  // Fetches user data using axios.post to the CHECK_USER_ROUTE.
  // If data retrieval fails (!data.status), redirects to login.
  // Otherwise, updates state using dispatch with user information.
  onAuthStateChanged(firebaseAuth, async (currentUser) => {
    if (!currentUser) setRedirectLogin(true);
    if (!userInfo && currentUser?.email) {
      const { data } = await axios.post(CHECK_USER_ROUTE, {
        email: currentUser.email,
      });
      if (!data.status) {
        router.push("/login");
      }

      dispatch({
        type: reducerCases.SET_USER_INFO,
        userInfo: {
          id: data?.data?.id,
          email: data?.data?.email,
          name: data?.data?.name,
          profileImage: data?.data?.profilePicture,
          status: data?.data?.about,
        },
      });
    }
  });

  useEffect(() => {
    if (userInfo) {
      socket.current = io(HOST);
      socket.current.emit("add-user", userInfo.id);
      dispatch({ type: reducerCases.SET_SOCKET, socket });
    }
  }, [userInfo]);

  //   Runs when socket.current or socketEvent state changes.
  // If socket.current exists and socketEvent is false:
  // Sets up event listeners for various socket events:
  // "msg-recieve": receives new messages and updates state using dispatch.
  // "online-users": receives online users and updates state using dispatch.
  // "mark-read-recieve": updates message read status in state using dispatch.
  // "incoming-voice-call": receives incoming voice call information and updates state using dispatch.
  // "voice-call-rejected": handles rejected voice call and updates state using dispatch.
  // "incoming-video-call": receives incoming video call information and updates state using dispatch.
  // "video-call-rejected": handles rejected video call and updates state using dispatch.
  // Sets socketEvent to true to prevent attaching listeners repeatedly.
  useEffect(() => {
    if (socket.current && !socketEvent) {
      socket.current.on("msg-recieve", (data) => {
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...data.message,
          },
        });
      });

      socket.current.on("online-users", ({ onlineUsers }) => {
        dispatch({
          type: reducerCases.SET_ONLINE_USERS,
          onlineUsers,
        });
      });

      socket.current.on("mark-read-recieve", ({ id, recieverId }) => {
        dispatch({
          type: reducerCases.SET_MESSAGES_READ,
          id,
          recieverId,
        });
      });

      socket.current.on("incoming-voice-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("voice-call-rejected", () => {
        dispatch({
          type: reducerCases.SET_INCOMING_VOICE_CALL,
          incomingVoiceCall: undefined,
        });
        dispatch({
          type: reducerCases.SET_VOICE_CALL,
          voiceCall: undefined,
        });
      });

      socket.current.on("incoming-video-call", ({ from, roomId, callType }) => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: { ...from, roomId, callType },
        });
      });

      socket.current.on("video-call-rejected", () => {
        dispatch({
          type: reducerCases.SET_INCOMING_VIDEO_CALL,
          incomingVideoCall: undefined,
        });
        dispatch({
          type: reducerCases.SET_VIDEO_CALL,
          videoCall: undefined,
        });
      });

      setSocketEvent(true);
    }
  }, [socket.current]);

  //   Runs when currentChatUser state changes.
  // Defines an async function getMessages to fetch messages from the server using axios.get.
  // If currentChatUser exists and the user is present in the contact list:
  // Calls getMessages to retrieve messages for the current chat.
  useEffect(() => {
    const getMessages = async () => {
      const {
        data: { messages },
      } = await axios.get(
        `${GET_MESSAGES_ROUTE}/${userInfo.id}/${currentChatUser.id}`
      );
      dispatch({ type: reducerCases.SET_MESSAGES, messages });
    };
    if (
      currentChatUser &&
      userContacts.findIndex((contact) => contact.id === currentChatUser.id) !==
        -1
    ) {
      getMessages();
    }
  }, [currentChatUser]);

  return (
    <>
      {incomingVoiceCall && <IncomingCall />}
      {incomingVideoCall && <IncomingVideoCall />}

      {videoCall && (
        <div className="h-screen w-screen max-h-full max-w-full overflow-hidden">
          <VideoCall />
        </div>
      )}
      {voiceCall && (
        <div className="h-screen w-screen max-h-full max-w-full overflow-hidden">
          <VoiceCall />
        </div>
      )}
      {!videoCall && !voiceCall && (
        <div className="grid grid-cols-main h-screen w-screen max-h-screen max-w-full overflow-hidden">
          <ChatList />
          {currentChatUser ? (
            <div className={messageSearch ? "grid grid-cols-2" : "grid-cols-2"}>
              <Chat />
              {messageSearch && <SearchMessages />}
            </div>
          ) : (
            <Empty />
          )}
        </div>
      )}
    </>
  );
}

// Renders the following conditionally based on state:
// Incoming Calls:
// IncomingCall component if incomingVoiceCall is present.
// IncomingVideoCall component if incomingVideoCall is present.
// Video Call:
// Video call UI (VideoCall component) within a container with specific styles if videoCall is present.
// Voice Call:
// Voice call UI (VoiceCall component) within a container with specific styles if voiceCall is present.
// Chat Interface (default):
// Grid layout with columns.
// ChatList component on the left.
// Conditionally renders content based on currentChatUser:
// If currentChatUser exists:
// Grid layout with or without a second column for search messages depending on messageSearch state.
// Chat component for chat functionality.
// SearchMessages component (if messageSearch is true) for searching messages.
// If currentChatUser does not exist:
// Empty component for displaying a placeholder when no chat is selected.
