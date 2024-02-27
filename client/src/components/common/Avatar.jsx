import React, { useEffect, useState } from "react";

import { FaCamera } from "react-icons/fa";
import ContextMenu from "./ContextMenu";
import PhotoPicker from "./PhotoPicker";
import PhotoLibrary from "./PhotoLibrary";
import CapturePhoto from "./CapturePhoto";

// hover: Tracks whether the avatar is hovered over (boolean).
// showPhotoLibrary: Controls the visibility of the photo library (boolean).
// grabImage: Triggers the hidden file input for selecting an image (boolean).
// isContextMenuVisible: Tracks the visibility of the context menu (boolean).
// isFirstRun: Manages a flag to handle initial context menu click (boolean).
// showCapturePhoto: Controls the visibility of the capture photo component (boolean).
// contextMenuCordinates: Stores the coordinates for positioning the context menu (object).
export default function Avatar({ type, image, setImage }) {
  const [hover, setHover] = useState(false);
  const [showPhotoLibrary, setShowPhotoLibrary] = useState(false);
  const [grabImage, setGrabImage] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const [isFirstRun, setIsFirstRun] = useState(true);
  const [showCapturePhoto, setShowCapturePhoto] = useState(false);
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });

  //   contextMenuOptions: Defines the options for the context menu:
  // "Take Photo": Opens the capture photo component.
  // "Choose from Library": Opens the photo library component.
  // "Upload Photo": Triggers the hidden file input for selecting an image.
  // "Remove Photo": Resets the image to the default avatar.
  const contextMenuOptions = [
    {
      name: "Take Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setShowCapturePhoto(true);
      },
    },
    {
      name: "Choose from Library",
      callBack: () => {
        setIsContextMenuVisible(false);
        setShowPhotoLibrary(true);
      },
    },
    {
      name: "Upload Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setGrabImage(true);
      },
    },
    {
      name: "Remove Photo",
      callBack: () => {
        setIsContextMenuVisible(false);
        setImage("/default_avatar.png");
      },
    },
  ];

  useEffect(() => {
    if (grabImage) {
      const data = document.getElementById("photo-picker");
      data.click();
      document.body.onfocus = (e) => {
        setGrabImage(false);
      };
    }
  }, [grabImage]);

  useEffect(() => {
    const handleClick = () => {
      if (!isFirstRun) {
        setIsContextMenuVisible(false);
        setIsFirstRun(true);
      } else setIsFirstRun(false);
    };
    if (isContextMenuVisible) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [isContextMenuVisible, isFirstRun]);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX, y: e.pageY });
    setIsContextMenuVisible(true);
  };

  // photoPickerOnChange: Handles changes in the hidden file input (triggered by the grabImage state).
  // Accesses the selected file from the event.
  // Creates a new FileReader object.
  // Creates a temporary image element to hold the loaded image data.
  // Defines a function to be called when the file is read successfully:
  // Sets the image source and data attribute of the temporary image element.
  // Starts reading the selected file using the FileReader.
  // Uses a setTimeout to set the image prop with the temporary image's source after a slight delay, allowing time for the image to load.
  const photoPickerOnChange = async (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    const data = document.createElement("img");
    reader.onload = function (event) {
      data.src = event.target.result;
      data.setAttribute("data-src", event.target.result);
    };
    reader.readAsDataURL(file);
    setTimeout(() => {
      setImage(data.src);
    }, 100);
  };

  return (
    <>
      <div className="flex items-center justify-center">
        {type === "sm" && (
          <img src={image} alt="avatar" className={`h-10 w-10 rounded-full`} />
        )}
        {type === "lg" && (
          <img src={image} alt="avatar" className={`h-14 w-14 rounded-full`} />
        )}
        {type === "xl" && (
          <div
            className="relative cursor-pointer z-0"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <div
              className={`bg-photopicker-overlay-background h-60 w-60 absolute top-0 left-0 rounded-full flex items-center justify-center flex-col text-center gap-2 ${
                hover ? "visible" : "hidden"
              }`}
              id="context-opener"
              onClick={(e) => showContextMenu(e)}
            >
              <FaCamera
                className="text-2xl"
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              />
              <span
                className=""
                id="context-opener"
                onClick={(e) => showContextMenu(e)}
              >
                Change <br></br> Profile <br></br> Photo
              </span>
            </div>
            <div className="flex items-center justify-center">
              <img
                src={image}
                alt="avatar"
                className={`h-60 w-60 rounded-full object-cover `}
              />
            </div>
          </div>
        )}
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          options={contextMenuOptions}
          cordinates={contextMenuCordinates}
          contextMenu={isContextMenuVisible}
          setContextMenu={setIsContextMenuVisible}
        />
      )}
      {grabImage && <PhotoPicker onChange={photoPickerOnChange} />}
      {showPhotoLibrary && (
        <PhotoLibrary
          setImage={setImage}
          hidePhotoLibrary={setShowPhotoLibrary}
        />
      )}
      {showCapturePhoto && (
        <CapturePhoto setImage={setImage} hide={setShowCapturePhoto} />
      )}
    </>
  );
}

// Side Effects (useEffect):

// First useEffect: Runs whenever grabImage changes.

// If grabImage is true:
// Accesses the hidden file input element with ID "photo-picker" and simulates a click event to open the file selection dialog.
// Sets a temporary body event listener to reset grabImage when the user clicks outside the file selection dialog.
// Second useEffect: Manages context menu visibility behavior.

// Runs whenever isContextMenuVisible changes.
// If isContextMenuVisible is true, adds a click event listener to the window.
// The event listener checks the isFirstRun flag:
// If not the first run (meaning the context menu was already opened), hides it and resets the flag.
// If the first run, sets the flag to false to allow subsequent clicks to toggle the menu.
// Cleanup function removes the event listener when the component unmounts or isContextMenuVisible changes.
