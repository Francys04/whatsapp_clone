import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_CALL_TOKEN } from "@/utils/ApiRoutes";
import axios from "axios";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MdOutlineCallEnd } from "react-icons/md";
import dynamic from "next/dynamic";

function Container({ data }) {
  const [{ socket, userInfo }, dispatch] = useStateProvider();
  const [localStream, setLocalStream] = useState(undefined);
  const [publishStream, setPublishStream] = useState(undefined);
  const [token, setToken] = useState(undefined);
  const [zgVar, setZgVar] = useState(undefined);
  const [callStarted, setCallStarted] = useState(false);
  const [callAccepted, setcallAccepted] = useState(false);

  // This defines a functional component called Container which takes a data prop.
  // It sets up multiple pieces of state using the useState hook to manage various aspects of the component's behavior.
  useEffect(() => {
    if (data.type === "out-going")
      socket.current.on("accept-call", () => setcallAccepted(true));
    else {
      setTimeout(() => {
        setcallAccepted(true);
      }, 1000);
    }
  }, [data]);

  // This useEffect hook fetches a call token from the server using Axios when callAccepted state changes.
  // It retrieves the token based on the userInfo.id and sets it in the component's state.
  useEffect(() => {
    const getToken = async () => {
      // Dynamically import ZegoExpressEngine from the module
      try {
        const {
          data: { token },
        } = await axios.get(`${GET_CALL_TOKEN}/${userInfo.id}`);
        setToken(token);
      } catch (err) {
        console.log(err);
      }
    };
    if (callAccepted) {
      getToken();
    }
  }, [callAccepted]);

  useEffect(() => {
    const startCall = async () => {
      // Dynamically import ZegoExpressEngine from the module
      import("zego-express-engine-webrtc").then(
        async ({ ZegoExpressEngine }) => {
          // Initialize ZegoExpressEngine
          const zg = new ZegoExpressEngine(
            process.env.NEXT_PUBLIC_ZEGO_APP_ID,
            process.env.NEXT_PUBLIC_ZEGO_SERVER_ID
          );
          setZgVar(zg);

          // Event listener for room stream updates
          zg.on(
            "roomStreamUpdate",
            async (roomID, updateType, streamList, extendedData) => {
              // Handle stream additions and deletions
              // This part is responsible for managing remote streams
            }
          );

          // Login to the room using ZegoExpressEngine
          await zg.loginRoom(
            data.roomId.toString(),
            token,
            { userID: userInfo.id.toString(), userName: userInfo.name },
            { userUpdate: true }
          );

          // Create a local stream and start publishing it
          setTimeout(async () => {
            const localStream = await zg.createStream({
              // Configuration for the local stream (camera/audio)
            });
            // Set local stream and start publishing it
            setLocalStream(localStream);
            // More setup for local stream publishing
          }, 1000);
        }
      );
    };
    if (token && !callStarted) {
      startCall();
      setCallStarted(true);
    }
  }, [token]);

  const endCall = () => {
    // Emit a "reject-voice-call" event to the socket
    const id = data.id;
    socket.current.emit("reject-voice-call", {
      from: id,
    });
    // Clean up local stream and end the call
    if (zgVar && localStream && publishStream) {
      zgVar.destroyStream(localStream);
      zgVar.stopPublishingStream(publishStream);
      zgVar.logoutRoom(data.roomId.toString());
    }
    // Dispatch action to end the call
    dispatch({ type: reducerCases.END_CALL });
  };

  // JSX for rendering the component UI

  return (
    <div className="border-conversation-border border-l w-full bg-conversation-panel-background flex flex-col h-[100vh] overflow-hidden items-center justify-center text-white ">
      <div className="flex flex-col gap-3 items-center">
        <span className="text-5xl">{data.name}</span>
        <span className="text-lg">
          {callAccepted && data.callType !== "video"
            ? "On going call"
            : "Calling"}
        </span>
      </div>
      {(!callAccepted || data.callType === "audio") && (
        <div className="my-24">
          <Image
            src={data.profilePicture}
            alt="avatar"
            height={300}
            width={300}
            className="rounded-full"
          />
        </div>
      )}
      <div className="my-5 relative" id="remote-video">
        <div className="absolute bottom-5 right-5" id="local-video"></div>
      </div>

      <div
        className="rounded-full h-16 w-16 bg-red-600 flex items-center justify-center"
        onClick={endCall}
      >
        <MdOutlineCallEnd className="text-3xl cursor-pointer" />
      </div>
    </div>
  );
}

export default Container;
