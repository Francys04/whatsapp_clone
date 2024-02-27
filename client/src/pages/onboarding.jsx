// React, useEffect, useState: Core React features for components, side effects, and state management.
// Avatar, Input: Custom components for displaying avatars and input fields.
// axios: For making HTTP requests to API endpoints.
// onBoardUserRoute: API route for onboarding a new user (imported from ApiRoutes).
// Resizer: Library for resizing images.
// Image: Next.js component for optimized image loading.
// useStateProvider: Context hook for accessing and updating state.
// useRouter: Next.js hook for routing and navigation.
// reducerCases: Constants for action types in the reducer.
import React, { useEffect, useState } from "react";
import Avatar from "../components/common/Avatar";
import Input from "../components/common/Input";
import axios from "axios";
import { onBoardUserRoute } from "../utils/ApiRoutes";

import Resizer from "react-image-file-resizer";

import Image from "next/image";
import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import { reducerCases } from "@/context/constants";

export default function OnBoarding() {
  //   const router = useRouter(): Accesses the router object for navigation.
  // const [{ userInfo, newUser }, dispatch] = useStateProvider(): Destructures state and dispatch function from useStateProvider context.
  // State Variables:

  // const [image, setImage]: State to manage avatar image, initialized with a default avatar image.
  // const [name, setName]: State for the display name, initialized with existing userInfo name or empty string.
  // const [about, setAbout]: State for the user's about text.
  const router = useRouter();

  const [{ userInfo, newUser }, dispatch] = useStateProvider();

  const [image, setImage] = useState("/default_avatar.png");
  const [name, setName] = useState(userInfo?.name || "");
  const [about, setAbout] = useState("");

  useEffect(() => {
    if (!newUser && !userInfo?.email) router.push("/login");
    else if (!newUser && userInfo?.email) router.push("/");
  }, [newUser, userInfo, router]);

  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        300,
        300,
        "PNG",
        80,
        0,
        (uri) => {
          resolve(uri);
        },
        "base64"
      );
    });
  // const onBoardUser: Function to handle user onboarding:
  // Validates details (currently only checking for name length).
  // If valid, fetches the image URI as a blob, resizes it, and sends a POST request to onBoardUserRoute with user details and resized image.
  // On success, updates state, dispatches actions to set newUser to false and update userInfo, and redirects to the home page.
  const onBoardUser = async () => {
    if (validateDetails()) {
      const email = userInfo?.email;
      try {
        const base64Response = await fetch(`${image}`);
        const blob = await base64Response.blob();
        setImage(await resizeFile(blob));
        const { data } = await axios.post(onBoardUserRoute, {
          email,
          name,
          about,
          image,
        });
        if (data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: false });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage: image,
              status: about,
            },
          });

          router.push("/");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const validateDetails = () => {
    if (name.length < 3) {
      // Toast Notification
      return false;
    }
    return true;
  };

  return (
    <div className="bg-panel-header-background h-screen w-screen text-white flex flex-col items-center justify-center">
      <div className="flex items-center justify-center gap-2">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={300}
          width={300}
        />
        <span className="text-7xl">WhatsApp</span>
      </div>
      <div></div>
      <h2 className="text-2xl ">Create your profile</h2>
      <div className="flex gap-6 mt-6 ">
        <div className="flex flex-col items-center justify-between mt-5 gap-6">
          <Input name="Display Name" state={name} setState={setName} label />
          <Input name="About" state={about} setState={setAbout} label />
          <div className="flex items-center justify-center">
            <button
              className="bg-search-input-container-background p-5 rounded-lg"
              onClick={onBoardUser}
            >
              Create Profile
            </button>
          </div>
        </div>
        <div>
          <Avatar type="xl" image={image} setImage={setImage} />
        </div>
      </div>
    </div>
  );
}

// Redirecting users based on login status.
// Gathering user information (name, about text, avatar image) for onboarding.
// Validating user input.
// Resizing the avatar image.
// Sending a POST request to the API to create a new user profile.
// Updating application state and redirecting to the home page on successful onboarding.
