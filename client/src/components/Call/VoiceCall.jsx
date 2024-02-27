import React, { useEffect } from "react";

// This function is likely used to access and manage the global state of the application using React's context API.
import { useStateProvider } from "@/context/StateContext";
import dynamic from "next/dynamic";
// This line dynamically imports the Container component from the @/components/Call/Container module using the dynamic function.
//  The ssr: false option ensures that the component is not server-side rendered.
const Container = dynamic(() => import("@/components/Call/Container"), {
  ssr: false,
});

function VoiceCall() {
  const [{ voiceCall, socket, userInfo }] = useStateProvider();
  // This useEffect hook runs when the voiceCall state variable changes.
  // If the type property of voiceCall is "out-going", it emits a socket event named "outgoing-voice-call" with relevant data.
  useEffect(() => {
    if (voiceCall.type === "out-going") {
      socket.current.emit("outgoing-voice-call", {
        to: voiceCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profileImage,
          name: userInfo.name,
        },
        callType: voiceCall.callType,
        roomId: voiceCall.roomId,
      });
    }
  }, [voiceCall]);
  return <Container data={voiceCall} />;
}

export default VoiceCall;
