import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { GET_ALL_CONTACTS } from "@/utils/ApiRoutes";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import ChatLIstItem from "./ChatLIstItem";
// useStateProvider: Destructures an empty state object and the dispatch function from context (likely for future implementation).
// allContacts: Stores all retrieved contacts initially as an empty object.
// searchTerm: Tracks the current search query entered by the user.
// searchContacts: Stores the filtered contacts based on the search query.
function ContactsList() {
  const [{}, dispatch] = useStateProvider();
  const [allContacts, setAllContacts] = useState({});
  const [searchTerm, setsearchTerm] = useState("");
  const [searchContacts, setSearchContacts] = useState([]);

  // Search Filter (useEffect):

  // First useEffect: Runs whenever searchTerm changes.
  // Checks if the search term has any length (characters entered).
  // If so, iterates through allContacts:
  // Initializes an empty object filteredData for storing filtered contacts.
  // Loops through each key (letter) in allContacts and filters the corresponding value (contact list) using the search term.
  // Filters contacts where the name (converted to lowercase) includes the lowercase search term.
  // Removes keys from filteredData if the filtered contact list for that key is empty.
  // Sets searchContacts to the filtered data.
  // If the search term is empty, sets searchContacts back to the original allContacts.
  useEffect(() => {
    if (searchTerm.length) {
      const filteredData = {};

      Object.keys(allContacts).forEach((key) => {
        filteredData[key] = allContacts[key].filter((obj) =>
          obj.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        if (!filteredData[key].length) {
          delete filteredData[key];
        }
      });

      setSearchContacts(filteredData);
    } else {
      setSearchContacts(allContacts);
    }
  }, [searchTerm]);

  // Fetching Contacts (useEffect):

  // Second useEffect: Runs only once after the component mounts.
  // Defines an async function getContacts to fetch contacts:
  // Makes a GET request to the GET_ALL_CONTACTS API endpoint using axios.
  // Upon successful response:
  // Extracts the users data from the response.
  // Sets allContacts and searchContacts states to the retrieved users data.
  // Catches and logs any errors during the API request.
  // Calls the getContacts function immediately after defining it.
  useEffect(() => {
    const getContacts = async () => {
      try {
        const {
          data: { users },
        } = await axios.get(GET_ALL_CONTACTS);

        setAllContacts(users);
        setSearchContacts(users);
      } catch (err) {
        console.log(err);
      }
    };
    getContacts();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex  items-center gap-12 text-white">
          <BiArrowBack
            className=" cursor-pointer text-xl"
            onClick={() =>
              dispatch({ type: reducerCases.SET_ALL_CONTACTS_PAGE })
            }
          />
          <span className="">New Chat</span>
        </div>
      </div>
      <div className="bg-search-input-container-background h-full flex-auto overflow-auto custom-scrollbar">
        <div className=" flex py-3 px-4 items-center gap-3 h-14">
          <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
            <div>
              <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
            </div>
            <div className="">
              <input
                type="text"
                placeholder="Search Contacts"
                className="bg-transparent text-sm focus:outline-none text-white w-full"
                onChange={(e) => setsearchTerm(e.target.value)}
                value={searchTerm}
              />
            </div>
          </div>
        </div>
        {Object.entries(searchContacts).map(([initialLetter, userList]) => {
          return (
            <div key={Date.now() + initialLetter}>
              <div className="text-teal-light pl-10 py-5">{initialLetter}</div>
              {userList.map((contact) => {
                return (
                  <ChatLIstItem
                    data={contact}
                    isContactPage={true}
                    key={contact.id}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ContactsList;
