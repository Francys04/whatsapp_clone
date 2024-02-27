// React Hooks: Imports useEffect, useRef, and useState for state management and refs.
// Icon: Imports IoClose icon from react-icons/io5.

import React, { useEffect, useRef, useState } from "react";
import { IoClose } from "react-icons/io5";
// Defines the functional component named CapturePhoto and accepts props for setImage (function to set the captured image)
// and hide (function to close the capture window).
export default function CapturePhoto({ setImage, hide }) {
  const videoRef = useRef();
  // Runs only once after the component mounts.
  // Defines a variable stream to hold the media stream.
  // Defines an async function startCamera that:
  // Requests access to the user's camera using navigator.mediaDevices.getUserMedia.
  // Sets the video source of the element referenced by videoRef to the captured stream.
  // Calls startCamera to start the camera.
  // Cleanup function stops the media stream tracks when the component unmounts.
  useEffect(() => {
    let stream;
    const startCamera = async () => {
      stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      videoRef.current.srcObject = stream;
    };
    startCamera();
    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);
  // const captureImage = () => { ... }: Defines a function to capture an image from the video.
  // Creates a canvas element.
  // Gets the 2D context of the canvas.
  // Draws the current frame of the video onto the canvas (scaled down to 300x150 pixels).
  // Converts the canvas content to a data URL representing a JPEG image and sets it as the image using setImage.
  // Calls hide with false to close the capture window after capturing the image
  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0, 300, 150);
    setImage(canvas.toDataURL("image/jpeg"));
    hide(false);
  };

  return (
    <div className="absolute h-4/6 w-2/6 top-1/4 left-1/3 bg-gray-900 flex-col gap-3 rounded-lg pt-2 flex items-center justify-between">
      <div className="flex flex-col gap-4 w-full">
        <div
          className="pt-2 pr-2 cursor-pointer flex items-end justify-end"
          onClick={() => hide(false)}
        >
          <IoClose className="h-10 w-10" />
        </div>
        <div className="flex justify-center">
          <video id="video" width="400" autoPlay ref={videoRef}></video>
        </div>
      </div>
      <button
        className=" h-16 w-16 bg-white rounded-full cursor-pointer border-8 border-teal-light p-2 mb-10"
        onClick={captureImage}
      ></button>
    </div>
  );
}
