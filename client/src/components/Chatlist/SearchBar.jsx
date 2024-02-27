import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import { useState } from "react";
import { BiFilter, BiSearchAlt2, BiArrowBack } from "react-icons/bi";

// const [{ contactSearch }, dispatch] = useStateProvider();: Destructures the following from context:
// contactSearch: The current search term for contacts.
// dispatch: A function for dispatching actions to update the context state.
export default function SearchBar() {
  const [{ contactSearch }, dispatch] = useStateProvider();

  return (
    <div className="bg-search-input-container-background flex py-3 pl-5 items-center gap-3 h-14">
      <div className="bg-panel-header-background flex items-center gap-5 px-3 py-1 rounded-lg flex-grow">
        <div>
          <BiSearchAlt2 className="text-panel-header-icon cursor-pointer text-l" />
        </div>
        <div className="">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="bg-transparent text-sm focus:outline-none text-white w-full"
            value={contactSearch}
            onChange={(e) =>
              dispatch({
                type: reducerCases.SET_CONTACT_SEARCH,
                contactSearch: e.target.value,
              })
            }
          />
        </div>
      </div>
      <div className="pr-5 pl-3">
        <BiFilter className="text-panel-header-icon cursor-pointer text-xl " />
      </div>
    </div>
  );
}

// Search Input:

// Creates a container with styling, rounding, and flex layout.
// Defines a search icon using the BiSearchAlt2 icon.
// Renders an input field with the following properties:
// Type: "text" for entering search terms.
// Placeholder: "Search or start new chat".
// Background: transparent to blend with the container.
// Text color: white.
// Value: Set to the current contactSearch value from context.
// On change: Triggers an anonymous function that dispatches an action using dispatch:
// Action type: reducerCases.SET_CONTACT_SEARCH.
// Payload: An object containing the updated contactSearch value from the event target.
