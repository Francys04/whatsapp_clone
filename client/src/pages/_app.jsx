// StateProvider: Imported from the StateContext file in the same directory (src/context/StateContext).
// This component provides context for managing application state.
// reducer, initialState: Imported from the StateReducers file in the same directory (src/context/StateReducers).
// These imports bring in the reducer function and initial state for handling application state.
// globals.css: Imported from the styles directory (src/styles/). This file likely contains global styles applied to the entire application.
// Head: Imported from Next.js. This component allows managing document head elements (title, meta tags, etc.) within the component.

import { StateProvider } from "@/context/StateContext";
import reducer, { initialState } from "@/context/StateReducers";
import "@/styles/globals.css";
import Head from "next/head";

// export default function App({ Component, pageProps }) {: Defines the default export of the file as a functional component named App.
//   Component: This prop will hold the actual React component to be rendered by the App.
//   pageProps: This prop holds any page-specific props passed from a Next.js page.
export default function App({ Component, pageProps }) {
  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Head>
        <title>Whatsapp</title>
        <link rel="shortcut icon" href="/favicon.png" />
      </Head>
      <Component {...pageProps} />
    </StateProvider>
  );
}

// Imports necessary components and styles.
// Defines a function named App that receives props for the component to render and page-specific props.
// Wraps the entire application with the StateProvider component to provide context for managing state using the imported reducer and initialState.
// Sets the title and favicon of the application using the Head component.
// Renders the specified component passed through the Component prop with any additional props received through pageProps.
