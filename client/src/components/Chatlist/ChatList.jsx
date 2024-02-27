import React, { useEffect, useState } from "react";
import ChatListHeader from "./ChatListHeader";
import List from "./List";
import SearchBar from "./SearchBar";
import ContactsList from "./ContactsList";
import { useStateProvider } from "@/context/StateContext";
// Defines the functional component named ChatList and marks it for export as the default.
export default function ChatList() {
  //  Creates a state variable named pageType with an initial value of "default"
  //  and a corresponding setter function setPageType. This state variable will determine which content is displayed in the component.
  const [pageType, setPageType] = useState("default");
  const [{ contactsPage }] = useStateProvider();
  // Sets up a useEffect hook that runs whenever the contactsPage value from context changes.
  useEffect(() => {
    if (contactsPage) {
      setPageType("all-contacts");
    } else {
      setPageType("default");
    }
  }, [contactsPage]);

  // Uses two conditional statements based on the pageType state:
  // pageType === "default": Renders the ChatListHeader, SearchBar, and List components when the default chat list view is desired.
  // pageType === "all-contacts": Renders the ContactsList component when the contacts page is open.

  return (
    <div className="bg-panel-header-background flex flex-col max-h-screen z-20 ">
      {pageType === "default" && (
        <>
          <ChatListHeader />
          <SearchBar />
          <List />
        </>
      )}
      {pageType === "all-contacts" && <ContactsList />}
    </div>
  );
}
