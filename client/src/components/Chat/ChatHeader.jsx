import React, { useState } from "react";
import Avatar from "../common/Avatar";
import { BsThreeDotsVertical } from "react-icons/bs";
import { BiSearchAlt2 } from "react-icons/bi";
import { MdCall } from "react-icons/md";
import { IoVideocam } from "react-icons/io5";
import { useStateProvider } from "@/context/StateContext";
import { reducerCases } from "@/context/constants";
import ContextMenu from "../common/ContextMenu";
// Defines a functional component named ChatHeader and marks it as the default export.
export default function ChatHeader() {
  //  Uses the useStateProvider hook to access various data from the context:
  // userInfo: User's own information.
  // currentChatUser: Information about the currently chatted user.
  // onlineUsers: List of online user IDs.
  // dispatch: Function to dispatch actions to the context reducer.
  const [{ userInfo, currentChatUser, onlineUsers }, dispatch] =
    useStateProvider();
  // Creates state using useState to store the x and y coordinates of the context menu when opened.
  const [contextMenuCordinates, setContextMenuCordinates] = useState({
    x: 0,
    y: 0,
  });
  // This function handles showing the context menu
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);

  const showContextMenu = (e) => {
    e.preventDefault();
    setContextMenuCordinates({ x: e.pageX - 50, y: e.pageY + 20 });
    setIsContextMenuVisible(true);
  };

  const contextMenuOptions = [
    {
      name: "Exit",
      callBack: async () => {
        setIsContextMenuVisible(false);
        dispatch({ type: reducerCases.SET_EXIT_CHAT });
      },
    },
  ];
  // This function handles initiating a video call:
  // It dispatches an action to the context reducer using dispatch.
  // The action type is SET_VIDEO_CALL.
  // It constructs a video call object with details:
  // User information from currentChatUser.
  // Call initiation type as "out-going".
  // Call type as "video".
  // A unique roomId generated using Date.now().
  const handleVideoCall = () => {
    dispatch({
      type: reducerCases.SET_VIDEO_CALL,
      videoCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "video",
        roomId: Date.now(),
      },
    });
  };
  // This function is similar to handleVideoCall but creates a voice call object with callType set to "audio".
  const handleVoiceCall = () => {
    dispatch({
      type: reducerCases.SET_VOICE_CALL,
      voiceCall: {
        ...currentChatUser,
        type: "out-going",
        callType: "audio",
        roomId: Date.now(),
      },
    });
  };

  return (
    <div className="h-16 px-4 py-3 flex justify-between items-center bg-panel-header-background z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar type="sm" image={currentChatUser?.profilePicture} />
        <div className="flex flex-col">
          <span className="text-primary-strong">{currentChatUser?.name}</span>
          <span className="text-secondary text-sm">
            {onlineUsers.includes(currentChatUser.id) ? "online" : "offline"}
          </span>
        </div>
      </div>
      <div className="flex gap-6 ">
        <MdCall
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVoiceCall}
        />
        <IoVideocam
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={handleVideoCall}
        />
        <BiSearchAlt2
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={() => dispatch({ type: reducerCases.SET_MESSAGES_SEARCH })}
        />
        <BsThreeDotsVertical
          className="text-panel-header-icon cursor-pointer text-xl"
          onClick={(e) => showContextMenu(e)}
          id="context-opener"
        />
        {isContextMenuVisible && (
          <ContextMenu
            options={contextMenuOptions}
            cordinates={contextMenuCordinates}
            contextMenu={isContextMenuVisible}
            setContextMenu={setIsContextMenuVisible}
          />
        )}
      </div>
    </div>
  );
}
