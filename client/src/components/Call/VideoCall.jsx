// This line imports the React library and the useEffect hook from the React package.
import React, { useEffect } from "react";
//This line imports the dynamic function from the next/dynamic module.
// The dynamic function allows you to dynamically import components in Next.js,
// which can be useful for code splitting and optimizing bundle size.
import dynamic from "next/dynamic";

// This line dynamically imports the Container component from the @/components/Call/Container module using the dynamic function.
//  The ssr: false option ensures that the component is not server-side rendered.
const Container = dynamic(() => import("@/components/Call/Container"), {
  ssr: false,
});

import { useStateProvider } from "@/context/StateContext";
// This declares a functional component named VideoCall.
function VideoCall() {
  // This line utilizes array destructuring to extract videoCall, socket, and userInfo from the return value of useStateProvider().
  const [{ videoCall, socket, userInfo }] = useStateProvider();
  useEffect(() => {
    console.warn({ videoCall });
  }, []);
  // This useEffect hook runs when the videoCall state variable changes.
  //  If the type property of videoCall is "out-going", it emits a socket event named "outgoing-video-call" with relevant data.
  useEffect(() => {
    if (videoCall.type === "out-going") {
      socket.current.emit("outgoing-video-call", {
        to: videoCall.id,
        from: {
          id: userInfo.id,
          profilePicture: userInfo.profileImage,
          name: userInfo.name,
        },
        callType: videoCall.callType,
        roomId: videoCall.roomId,
      });
    }
  }, [videoCall]);
  // This renders the Container component with the videoCall data passed as props.
  return <Container data={videoCall} />;
}

export default VideoCall;
