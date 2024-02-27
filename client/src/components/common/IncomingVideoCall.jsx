import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import Image from "next/image";
import React, { useEffect, useState } from "react";

// const [{ incomingVideoCall, socket }, dispatch] = useStateProvider();: Uses the useStateProvider hook to access state:
// incomingVideoCall: Object containing information about the incoming call.
// socket: Reference to the socket object used for communication.
// dispatch function to update state using the reducer.
// const [audioElement, setAudioElement] = useState(null);: Creates a state variable audioElement
// to hold a reference to the audio object (initially null).
function IncomingVideoCall() {
  const [{ incomingVideoCall, socket }, dispatch] = useStateProvider();
  const [audioElement, setAudioElement] = useState(null);
  // First useEffect: Runs only once after the component mounts.
  // Creates an audio element and sets its source to "/call-sound.mp3".
  // Sets the loop property to true to make the audio play continuously.
  // Sets the audioElement state to the created audio object.
  // Cleanup function removes any event listeners associated with the audio element when the component unmounts to prevent memory leaks.
  useEffect(() => {
    const audio = new Audio("/call-sound.mp3");
    audio.loop = true;
    setAudioElement(audio);
  }, []);

  // Second useEffect: Runs whenever the audioElement state changes.
  // Checks if audioElement is not null (meaning it exists).
  // If so, plays the audio and sets a cleanup function to pause the audio,
  //  reset the current time to 0, and remove potential event listeners when the component unmounts or audioElement changes to null.

  useEffect(() => {
    if (audioElement) {
      audioElement.play();

      return () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      };
    }
  }, [audioElement]);

  const acceptCall = () => {
    const call = incomingVideoCall;
    console.warn({ call });
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: { ...call, type: "in-coming" },
    });
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });
    socket.current.emit("accept-incoming-call", { id: incomingVideoCall.id });
  };

  const rejectCall = () => {
    const call = incomingVideoCall;
    dispatch({
      type: reducerCases.SET_INCOMING_VIDEO_CALL,
      incomingVideoCall: undefined,
    });
    socket.current.emit("reject-video-call", {
      from: call.id,
    });
  };

  return (
    <div className="h-24 w-80 fixed bottom-8 mb-0 right-6 z-50 rounded-sm flex gap-5 items-center justify-start p-4 bg-conversation-panel-background text-white drop-shadow-2xl border-icon-green border-2 py-14">
      <div>
        <Image
          src={incomingVideoCall.profilePicture}
          alt="avatar"
          width={70}
          height={70}
          className="rounded-full"
        />
      </div>
      <div>
        <div>{incomingVideoCall.name}</div>
        <div className="text-xs">Incoming Video Call</div>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 p-1 px-3 text-sm rounded-full"
            onClick={rejectCall}
          >
            Reject
          </button>
          <button
            className="bg-green-500 p-1 px-3 text-sm rounded-full"
            onClick={acceptCall}
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

export default IncomingVideoCall;
