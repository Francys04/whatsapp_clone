// axios: Used for making HTTP requests to an API.
// GoogleAuthProvider, signInWithPopup: Functions from Firebase for Google Sign-in.
// React, useEffect: React and a hook for handling side effects.
// FcGoogle: Icon component for Google.
// firebaseAuth: Imported from FirebaseConfig (likely containing Firebase configuration).

import axios from "axios";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { firebaseAuth } from "../utils/FirebaseConfig";

import { useStateProvider } from "@/context/StateContext";
import { useRouter } from "next/router";
import Image from "next/image";
import { reducerCases } from "@/context/constants";
import { CHECK_USER_ROUTE } from "@/utils/ApiRoutes";

// const router = useRouter(): Creates a router object for navigation.
// const [{ userInfo, newUser }, dispatch] = useStateProvider(): Destructures state and dispatch from useStateProvider.
// useEffect:
// Logs the userInfo object for debugging purposes.
// Redirects to the home page (/) if userInfo exists and newUser is false (user already logged in and not new).
export default function Login() {
  const router = useRouter();
  const [{ userInfo, newUser }, dispatch] = useStateProvider();
  useEffect(() => {
    console.log({ userInfo });
    if (userInfo?.id && !newUser) router.push("/");
  }, [userInfo, newUser, router]);
  const login = async () => {
    const provider = new GoogleAuthProvider();
    const {
      user: { displayName: name, email, photoURL: profileImage },
    } = await signInWithPopup(firebaseAuth, provider);

    //     login: Asynchronous function for handling Google sign-in.
    // const provider = new GoogleAuthProvider(): Creates a GoogleAuthProvider.
    // try...catch: Handles potential errors during sign-in.
    // signInWithPopup: Attempts sign-in with Google.
    // On success:
    // Extracts user information (name, email, profile picture).
    // Makes a POST request using axios to CHECK_USER_ROUTE with the email.
    // If user doesn't exist (new user):
    // Sets newUser to true in state.
    // Sets userInfo state with extracted user information and "Available" status.
    // Redirects to /onboarding.
    // If user exists:
    // Sets userInfo state with retrieved user information.
    // Redirects to the home page (/).
    // On error: Logs the error message.
    const login = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(firebaseAuth, provider);
        const { user } = result;
        const { displayName: name, email, photoURL: profileImage } = user;

        // Proceed with user authentication
        // ...
      } catch (error) {
        console.error("Authentication Error:", error.code, error.message);
        // Handle the error, display an error message, or retry authentication
      }
    };

    try {
      if (email) {
        const { data } = await axios.post(CHECK_USER_ROUTE, {
          email,
        });

        if (!data.status) {
          dispatch({ type: reducerCases.SET_NEW_USER, newUser: true });
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              name,
              email,
              profileImage,
              status: "Available",
            },
          });
          router.push("/onboarding");
        } else {
          dispatch({
            type: reducerCases.SET_USER_INFO,
            userInfo: {
              id: data.data.id,
              email: data.data.email,
              name: data.data.name,
              profileImage: data.data.profilePicture,
              status: data.data.about,
            },
          });
          router.push("/");
        }
      }
    } catch (error) {
      console.log({ error });
    }
  };
  return (
    <div className="flex justify-center items-center bg-panel-header-background h-screen w-screen flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-white">
        <Image
          src="/whatsapp.gif"
          alt="whatsapp-gif"
          height={300}
          width={300}
        />
        <span className="text-7xl">WhatsApp</span>
      </div>
      <button
        className="flex items-center justify-center gap-7 bg-search-input-container-background p-5 rounded-lg"
        onClick={login}
      >
        <FcGoogle className="text-4xl" />
        <span className="text-white text-2xl">Login With Google</span>
      </button>
    </div>
  );
}
