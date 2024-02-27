// Context: Imports useStateProvider and reducerCases from context for accessing data and dispatching actions.
// API Routes: Imports ADD_AUDIO_MESSAGE_ROUTE for the API endpoint to send audio messages.
// Axios: Imports axios for making HTTP requests.
// Firebase: Imports setPersistence from Firebase Auth (not used in this component).
// React Hooks: Imports useState, useRef, and useEffect for state management, refs, and side effects.
// Icons: Imports icons from react-icons/fa and react-icons/md.
// WaveSurfer: Imports WaveSurfer for audio visualization and playback.

import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { ADD_AUDIO_MESSAGE_ROUTE } from "@/utils/ApiRoutes";
import axios from "axios";
import { setPersistence } from "firebase/auth";
import React, { useState, useRef, useEffect } from "react";
import {
  FaMicrophone,
  FaPauseCircle,
  FaPlay,
  FaStop,
  FaTrash,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import WaveSurfer from "wavesurfer.js";

// Defines the functional component named AudioRecorder and accepts a hide function prop to hide the recorder.
// Context:
// userInfo: User information from context.
// currentChatUser: Current chat user information from context.
// socket: Socket object from context.
// Component state:
// isRecording: Tracks whether audio recording is in progress (boolean).
// recordingDuration: Duration of the recording in seconds (number).
// currentPlaybackTime: Current playback time of the audio (number).
// totalDuration: Total duration of the recorded audio (number).
// Refs:
// waveformRef: Ref for the WaveSurfer container element.
// audioRef: Ref for the hidden audio element used for recording.
// mediaRecorderRef: Ref for the MediaRecorder object
const AudioRecorder = ({ hide }) => {
  const [{ userInfo, currentChatUser, socket }, dispatch] = useStateProvider();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [currentPlaybackTime, setCurrentPlaybackTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const [waveform, setWaveform] = useState(null);
  const [recordedAudio, setRecordedAudio] = useState(null);

  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const waveformRef = useRef(null);

  // Runs whenever isRecording changes.
  // If isRecording is true, sets up an interval to update recordingDuration and totalDuration every second.
  // Cleanup function clears the interval when the component unmounts or isRecording changes to false.
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prevDuration) => {
          setTotalDuration(prevDuration + 1);
          return prevDuration + 1;
        });
      }, 1000);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isRecording]);

  //   Runs only once after the component mounts.
  // Creates a WaveSurfer instance and assigns it to the waveform state.
  // Sets up event listeners for the WaveSurfer:
  // finish: Called when playback finishes.
  // Cleanup function destroys the WaveSurfer instance when the component unmounts.
  useEffect(() => {
    const wavesurfer = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#ccc",
      progressColor: "#4a9eff",
      cursorColor: "#7ae3c3",
      barWidth: 2,
      height: 30,
      responsive: true,
    });
    setWaveform(wavesurfer);

    wavesurfer.on("finish", () => {
      setisPlaying(false);
    });

    return () => {
      wavesurfer.destroy();
    };
  }, []);

  useEffect(() => {
    if (waveform) {
      handleStartRecording();
    }
  }, [waveform]);

  //   Resets recording and playback states.
  // Sets isRecording to true.
  // Requests microphone access using navigator.mediaDevices.getUserMedia.
  // On success:
  // Creates a MediaRecorder instance and stores it in the mediaRecorderRef.
  // Sets the audio source for the hidden audio element (audioRef) to the captured media stream.
  // Initializes an empty array to store audio chunks.
  // Sets up event listeners for the MediaRecorder:
  // dataavailable: Pushes recorded audio chunks to the array.
  // stop: Creates a Blob from the chunks, creates an audio URL, and sets up the recorded audio:
  // Sets recordedAudio to a new Audio object with the audio URL.
  // Loads the audio URL into the WaveSurfer for visualization.
  // Starts the MediaRecorder.
  // On error: Logs the error message.
  const handleStartRecording = () => {
    setRecordingDuration(0);
    setCurrentPlaybackTime(0);
    setTotalDuration(0);

    setIsRecording(true);

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioRef.current.srcObject = stream;

        const chunks = [];
        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = () => {
          const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
          const audioURL = URL.createObjectURL(blob);
          const audio = new Audio(audioURL);
          setRecordedAudio(audio);

          waveform.load(audioURL);
        };

        mediaRecorder.start();
      })
      .catch((error) => {
        console.error("Error accessing microphone:", error);
      });
  };

  const [renderedAudio, setRenderedAudio] = useState(null);
  // Checks if there's a MediaRecorder instance and recording is in progress.
  // Stops the recording and WaveSurfer playback.
  // Adds event listeners to the MediaRecorder:
  // dataavailable: Pushes recorded audio chunks to a new array.
  // stop: Creates an MP3 Blob, creates an audio file object, and sets renderedAudio.
  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      waveform.stop();

      const audioChunks = [];
      mediaRecorderRef.current.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });

      mediaRecorderRef.current.addEventListener("stop", () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/mp3" });
        const audioFile = new File([audioBlob], "recording.mp3");
        setRenderedAudio(audioFile);
      });
    }
  };

  const [isPlaying, setisPlaying] = useState(false);

  const handlePlayRecordedAudio = () => {
    if (recordedAudio) {
      waveform.stop();
      waveform.play();
      recordedAudio.play();
      setisPlaying(true);
    }
  };

  const handlePauseRecordingAudio = () => {
    waveform.stop();
    recordedAudio.pause();
    setisPlaying(false);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    if (recordedAudio) {
      const updatePlaybackTime = () => {
        setCurrentPlaybackTime(recordedAudio.currentTime);
      };
      recordedAudio.addEventListener("timeupdate", updatePlaybackTime);
      return () => {
        recordedAudio.removeEventListener("timeupdate", updatePlaybackTime);
      };
    }
  }, [recordedAudio]);

  const sendRecording = async () => {
    try {
      const formData = new FormData();
      formData.append("audio", renderedAudio);
      const response = await axios.post(ADD_AUDIO_MESSAGE_ROUTE, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          from: userInfo.id,
          to: currentChatUser.id,
        },
      });
      if (response.status === 201) {
        socket.current.emit("send-msg", {
          to: currentChatUser.id,
          from: userInfo.id,
          message: response.data.message,
        });
        dispatch({
          type: reducerCases.ADD_MESSAGE,
          newMessage: {
            ...response.data.message,
          },
          fromSelf: true,
        });
        hide();
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex text-2xl w-full justify-end items-center">
      <div className="pt-1">
        <FaTrash className="text-panel-header-icon" onClick={() => hide()} />
      </div>
      <div className="mx-4 py-2 px-4 text-white text-lg flex gap-3 justify-center items-center bg-search-input-container-background rounded-full drop-shadow-lg">
        {isRecording ? (
          <div className="text-red-500 animate-blink w-60 text-center">
            Recording <span>({recordingDuration}s)</span>
          </div>
        ) : (
          <div className=" ">
            {recordedAudio && (
              <>
                {!isPlaying ? (
                  <FaPlay onClick={handlePlayRecordedAudio} />
                ) : (
                  <FaStop onClick={handlePauseRecordingAudio} />
                )}
              </>
            )}
          </div>
        )}
        <div className="w-60" ref={waveformRef} hidden={isRecording} />
        {recordedAudio && isPlaying && (
          <span>{formatTime(currentPlaybackTime)}</span>
        )}
        {recordedAudio && !isPlaying && (
          <span>{formatTime(totalDuration)}</span>
        )}
        <audio ref={audioRef} hidden />
      </div>

      <div className="mr-4 ">
        {!isRecording ? (
          <FaMicrophone
            className="text-red-500"
            onClick={handleStartRecording}
          />
        ) : (
          <FaPauseCircle
            className="text-red-500"
            onClick={handleStopRecording}
          />
        )}
      </div>
      <div>
        <MdSend
          className="text-panel-header-icon cursor-pointer mr-4 "
          title="Send"
          onClick={sendRecording}
        />
      </div>
    </div>
  );
};

export default AudioRecorder;
