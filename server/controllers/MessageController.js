import { renameSync } from "fs";
import getPrismaInstance from "../utils/PrismaClient.js";
// renameSync: Function from fs module for renaming files.
// getPrismaInstance: Function to get a Prisma client instance (likely imported from PrismaClient.js).
// getMessages Endpoint:

// Purpose: Retrieves messages between two users (from and to).
// Parameters:
// req: Incoming HTTP request object.
// res: Outgoing HTTP response object.
// next: Function to pass any errors to the middleware.
// Logic:
// Connects to the Prisma database using getPrismaInstance.
// Extracts from and to user IDs from request parameters.
// Queries the messages table using findMany to find messages where:
// senderId is equal to from and recieverId is equal to to, or
// senderId is equal to to and recieverId is equal to from.
// Sorts the messages chronologically by id.
// Initializes an empty array unreadMessages to store unread message IDs.
// Iterates through messages:
// If a message is unread (messageStatus is not "read") and belongs to the recipient (senderId is equal to to), mark it as read and add its ID to unreadMessages.
// Updates unread messages using prisma.messages.updateMany by setting their messageStatus to "read".
// Returns a JSON response with status code 200 and the retrieved messages.
// Catches any errors and passes them to the next function for handling.
export const getMessages = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const { from, to } = req.params;
    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          {
            senderId: parseInt(from),
            recieverId: parseInt(to),
          },
          {
            senderId: parseInt(to),
            recieverId: parseInt(from),
          },
        ],
      },
      orderBy: {
        id: "asc",
      },
    });
    const unreadMessages = [];

    messages.forEach((message, index) => {
      if (
        message.messageStatus !== "read" &&
        message.senderId === parseInt(to)
      ) {
        messages[index].messageStatus = "read";
        unreadMessages.push(message.id);
      }
    });

    await prisma.messages.updateMany({
      where: {
        id: { in: unreadMessages },
      },
      data: {
        messageStatus: "read",
      },
    });
    res.status(200).json({ messages });
  } catch (err) {
    next(err);
  }
};
// addMessage Endpoint:

// Purpose: Creates a new message between two users.
// Parameters: Same as getMessages.
// Logic:
// Connects to the Prisma database using getPrismaInstance.
// Extracts message, from, and to from the request body.
// Checks if all required fields are present.
// Uses getUser from onlineUsers to check if the recipient is online (optional logic).
// Creates a new message using prisma.messages.create:
// Sets the message content.
// Connects the sender and receiver using sender and reciever relations with their IDs.
// Sets the messageStatus to "delivered" if the recipient is online, otherwise "sent".
// Includes the sender and receiver user details in the response using include option.
// Returns a JSON response with status code 201 and the newly created message.
// Returns a 400 error message if any required field is missing.
// Catches any errors and passes them to the next function for handling.

export const addMessage = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();

    const { message, from, to } = req.body;
    const getUser = onlineUsers.get(to);

    if (message && from && to) {
      const newMessage = await prisma.messages.create({
        data: {
          message: message,
          sender: { connect: { id: parseInt(from) } },
          reciever: { connect: { id: parseInt(to) } },
          messageStatus: getUser ? "delivered" : "sent",
        },
        include: { sender: true, reciever: true },
      });
      return res.status(201).send({ message: newMessage });
    }
    return res.status(400).send("From, to and Message is required.");
  } catch (err) {
    next(err);
  }
};
// getInitialContactsWithMessages Endpoint:

// Purpose: Retrieves initial contacts (including sent and received messages) for a user.
// Parameters: Same as getMessages.
// Logic:
// Extracts the from (user) ID from request parameters.
// Connects to the Prisma database using getPrismaInstance.
// Fetches the user with the provided ID using prisma.user.findUnique:
// Includes sentMessages and recievedMessages with relations:
// Includes reciever and sender user details in each message.
// Sorts messages by creation time (descending order).
// Combines both sent and received messages into a single array.
// Sorts the combined messages by creation time (descending order).
// Creates a Map to store information about contacts (users).
// Creates an empty array messageStatusChange to store IDs of messages needing status update.
// Iterates through messages:
// Calculates the "other user" ID based on the sender.
// Marks unread messages as read and updates their status if they belong to the recipient.
// Builds a user object (contact) for each unique contact ID, including:
// Message details (ID, type, message, status, creation time).
// Sender or receiver details depending on the message direction.
// totalUnreadMessages (calculated for the recipient's received messages).
// Adds the user object to the users Map.
// Updates message statuses from "sent" to "delivered" if needed (using `prisma.messages.
export const getInitialContactsWithMessages = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.from);
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentMessages: {
          include: { reciever: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
        recievedMessages: {
          include: { reciever: true, sender: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
    const messages = [...user.sentMessages, ...user.recievedMessages];
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const users = new Map();
    const messageStatusChange = [];

    messages.forEach((msg) => {
      const isSender = msg.senderId === userId;
      const calculatedId = isSender ? msg.recieverId : msg.senderId;
      if (msg.messageStatus === "sent") {
        messageStatusChange.push(msg.id);
      }
      if (!users.get(calculatedId)) {
        const {
          id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        } = msg;
        let user = {
          messageId: id,
          type,
          message,
          messageStatus,
          createdAt,
          senderId,
          recieverId,
        };
        if (isSender) {
          user = {
            ...user,
            ...msg.reciever,
            totalUnreadMessages: 0,
          };
        } else {
          user = {
            ...user,
            ...msg.sender,
            totalUnreadMessages: messageStatus !== "read" ? 1 : 0,
          };
        }
        users.set(calculatedId, {
          ...user,
        });
      } else if (msg.messageStatus !== "read" && !isSender) {
        const user = users.get(calculatedId);
        users.set(calculatedId, {
          ...user,
          totalUnreadMessages: user.totalUnreadMessages + 1,
        });
      }
    });

    if (messageStatusChange.length) {
      await prisma.messages.updateMany({
        where: {
          id: { in: messageStatusChange },
        },
        data: {
          messageStatus: "delivered",
        },
      });
    }

    return res.status(200).json({
      users: Array.from(users.values()),
      onlineUsers: Array.from(onlineUsers.keys()),
    });
  } catch (err) {
    next(err);
  }
};

export const addAudioMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/recordings/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "audio",
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("Audio is required.");
  } catch (err) {
    next(err);
  }
};

export const addImageMessage = async (req, res, next) => {
  try {
    if (req.file) {
      const date = Date.now();
      let fileName = "uploads/images/" + date + req.file.originalname;
      renameSync(req.file.path, fileName);
      const prisma = getPrismaInstance();
      const { from, to } = req.query;
      if (from && to) {
        const message = await prisma.messages.create({
          data: {
            message: fileName,
            sender: { connect: { id: parseInt(from) } },
            reciever: { connect: { id: parseInt(to) } },
            type: "image",
          },
        });
        return res.status(201).json({ message });
      }
      return res.status(400).send("From, to is required.");
    }
    return res.status(400).send("Image is required.");
  } catch (err) {
    next(err);
  }
};
