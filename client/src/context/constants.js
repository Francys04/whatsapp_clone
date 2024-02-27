// SET_USER_INFO: Represents the action type for setting the user's information (name, email, profile picture, etc.) in the state.
// SET_NEW_USER: Represents the action type for adding a new user to the state (potentially used for managing multiple user accounts).
// SET_ALL_CONTACTS_PAGE: Represents the action type for setting whether the "all contacts" page is currently being viewed in the UI.
// CHANGE_CURRENT_CHAT_USER: Represents the action type for changing the currently selected chat user.
// SET_SOCKET: Represents the action type for setting the socket instance in the state.
// SET_MESSAGES: Represents the action type for setting the complete list of messages for a chat.
// ADD_MESSAGE: Represents the action type for adding a new message to the message list.
// SET_USER_CONTACTS: Represents the action type for setting the user's contact list.
// SET_VOICE_CALL: Represents the action type for setting the information about an ongoing voice call.
// SET_VIDEO_CALL: Represents the action type for setting the information about an ongoing video call.
// END_CALL: Represents the action type for ending an ongoing call (voice or video).
// SET_INCOMING_VOICE_CALL: Represents the action type for setting information about an incoming voice call.
// SET_INCOMING_VIDEO_CALL: Represents the action type for setting information about an incoming video call.
// SET_EXIT_CHAT: Represents the action type for exiting the current chat.
// SET_MESSAGES_READ: Represents the action type for updating the read status of messages.
// SET_ONLINE_USERS: Represents the action type for setting the information about online users.
// SET_MESSAGES_SEARCH: Represents the action type for managing the message search state (active or inactive).
// SET_CONTACT_SEARCH: Represents the action type for managing the contact search state (active or inactive).

export const reducerCases = {
  SET_USER_INFO: "SET_USER_INFO",
  SET_NEW_USER: "SET_NEW_USER",
  SET_ALL_CONTACTS_PAGE: "SET_ALL_CONTACTS_PAGE",
  CHANGE_CURRENT_CHAT_USER: "CHANGE_CURRENT_CHAT_USER",
  SET_SOCKET: "SET_SOCKET",
  SET_MESSAGES: "SET_MESSAGES",
  ADD_MESSAGE: "ADD_MESSAGE",
  SET_USER_CONTACTS: "USER_CONTACTS",
  SET_VOICE_CALL: "SET_VOICE_CALL",
  SET_VIDEO_CALL: "SET_VIDEO_CALL",
  END_CALL: "END_CALL",
  SET_INCOMING_VOICE_CALL: "SET_INCOMING_VOICE_CALL",
  SET_INCOMING_VIDEO_CALL: "SET_INCOMING_VIDEO_CALL",
  SET_EXIT_CHAT: "SET_EXIT_CHAT",
  SET_MESSAGES_READ: "SET_MESSAGES_READ",
  SET_ONLINE_USERS: "SET_ONLINE_USERS",
  SET_MESSAGES_SEARCH: "SET_MESSAGES_SEARCH",
  SET_CONTACT_SEARCH: "SET_CONTACT_SEARCH",
};
