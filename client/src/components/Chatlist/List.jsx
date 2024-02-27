import React, { useEffect } from "react";
import ChatLIstItem from "./ChatLIstItem";
import { useStateProvider } from "@/context/StateContext";
import axios from "axios";
import { GET_INITIAL_CONTACTS_ROUTE } from "@/utils/ApiRoutes";
import { reducerCases } from "@/context/constants";

// const [{ userInfo, userContacts, filteredContacts }, dispatch] = useStateProvider();: Destructures the following from context:
// userInfo: Information about the current user.
// userContacts: The user's list of contacts.
// filteredContacts: Filtered contacts, likely based on a search query.
// dispatch: A function for dispatching actions to update the context state.
export default function List() {
  const [{ userInfo, userContacts, filteredContacts }, dispatch] =
    useStateProvider();

  //     useEffect: Runs only once after the component mounts.
  // Wraps the code in a try...catch block to handle errors.
  // Defines an async function getContacts to fetch contacts:
  // Uses axios.get to make a GET request to the GET_INITIAL_CONTACTS_ROUTE API endpoint, passing the current user's ID in the URL.
  // Extracts users and onlineUsers from the response data.
  // Dispatches actions to set the userContacts and onlineUsers in context.
  // Calls getContacts only if userInfo.id is available.
  useEffect(() => {
    try {
      const getContacts = async () => {
        const {
          data: { users, onlineUsers },
        } = await axios.get(`${GET_INITIAL_CONTACTS_ROUTE}/${userInfo.id}`);
        dispatch({ type: reducerCases.SET_USER_CONTACTS, userContacts: users });
        dispatch({ type: reducerCases.SET_ONLINE_USERS, onlineUsers });
      };
      if (userInfo?.id) {
        getContacts();
      }
    } catch (err) {
      console.error(err);
    }
  }, [userInfo]);
  return (
    <div className="bg-search-input-container-background flex-auto overflow-auto max-h-full custom-scrollbar">
      {filteredContacts && filteredContacts.length > 0
        ? filteredContacts.map((contact) => {
            return <ChatLIstItem data={contact} key={contact.id} />;
          })
        : userContacts.map((contact) => {
            return <ChatLIstItem data={contact} key={contact.id} />;
          })}
    </div>
  );
}
