// getPrismaInstance: Function to get a Prisma client instance (likely imported from PrismaClient.js).
// generateToken04: Function to generate a token (likely imported from TokenGenerator.js).

import getPrismaInstance from "../utils/PrismaClient.js";
import { generateToken04 } from "../utils/TokenGenerator.js";
// checkUser Endpoint:

// Purpose: Checks if a user exists based on the provided email in the request body.
// Parameters:
// request: Incoming HTTP request object.
// response: Outgoing HTTP response object.
// next: Function to pass any errors to the middleware.
// Logic:
// Extracts the email from the request body.
// If email is missing, returns an error message.
// Connects to the Prisma database using getPrismaInstance.
// Queries the user table using findUnique to find a user with the provided email.
// If the user is found:
// Returns a JSON response with a success message, status set to true, and the user data.
// If the user is not found:
// Returns a JSON response with an error message and status set to false.
// Catches any errors and passes them to the next function for handling.
export const checkUser = async (request, response, next) => {
  try {
    const { email } = request.body;
    if (!email) {
      return response.json({ msg: "Email is required", status: false });
    }
    const prisma = getPrismaInstance();
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return response.json({ msg: "User not found", status: false });
    } else
      return response.json({ msg: "User Found", status: true, data: user });
  } catch (error) {
    next(error);
  }
};
// onBoardUser Endpoint:

// Purpose: Creates a new user in the database.
// Parameters: Same as checkUser.
// Logic:
// Logs the request body for debugging purposes.
// Extracts email, name, about (optional, defaults to "Available"), and profilePicture from the request body.
// If any of the required fields (email, name, or profilePicture) are missing, returns an error message.
// Connects to the Prisma database using getPrismaInstance.
// Uses prisma.user.create to create a new user with the provided information.
// On success, returns a JSON response with a success message and status set to true.
// Catches any errors and passes them to the next function for handling.
export const onBoardUser = async (request, response, next) => {
  try {
    console.log("Request Body:", request.body); // Log the request body
    const {
      email,
      name,
      about = "Available",
      image: profilePicture,
    } = request.body;
    if (!email || !name || !profilePicture) {
      return response.json({
        msg: "Email, Name and Image are required",
      });
    } else {
      const prisma = getPrismaInstance();
      await prisma.user.create({
        data: { email, name, about, profilePicture },
      });
      return response.json({ msg: "Success", status: true });
    }
  } catch (error) {
    next(error);
  }
};
// getAllUsers Endpoint:

// Purpose: Retrieves all users from the database, grouped by the first letter of their name.
// Parameters: Same as checkUser.
// Logic:
// Connects to the Prisma database using getPrismaInstance.
// Queries the user table using findMany to retrieve all users.
// Sorts the users alphabetically by name using orderBy.
// Selects specific user fields (id, email, name, profilePicture, and about) using select.
// Groups the users by the first letter of their name in an object.
// Returns a JSON response with status code 200 and an object containing the grouped users.
// Catches any errors and passes them to the next function for handling.
export const getAllUsers = async (req, res, next) => {
  try {
    const prisma = getPrismaInstance();
    const users = await prisma.user.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        about: true,
      },
    });
    const usersGroupedByInitialLetter = {};
    users.forEach((user) => {
      const initialLetter = user.name.charAt(0).toUpperCase();
      if (!usersGroupedByInitialLetter[initialLetter]) {
        usersGroupedByInitialLetter[initialLetter] = [];
      }
      usersGroupedByInitialLetter[initialLetter].push(user);
    });

    return res.status(200).send({ users: usersGroupedByInitialLetter });
  } catch (error) {
    next(error);
  }
};
// generateToken Endpoint:

// Purpose: Generates a Zego token for a user.
// Parameters: Same as checkUser.
// Logic:
// Retrieves the Zego app ID from the environment variable ZEGO_APP_ID.
// Retrieves the Zego server secret from the environment variable ZEGO_APP_SECRET.
// Extracts the userId from the request parameters (req.params).
// Sets the token expiration time to 3600 seconds (1 hour).
// Uses the provided information and generateToken04 function to generate a token.
// If all required information is available:
// Returns a JSON response with the generated token and status code 200.
// If any required information is missing:
// Returns an error message with status code 400.
// Catches any errors and passes them to the next function for handling.
export const generateToken = (req, res, next) => {
  try {
    const appID = parseInt(process.env.ZEGO_APP_ID);
    const serverSecret = process.env.ZEGO_APP_SECRET;
    const userId = req.params.userId;
    const effectiveTimeInSeconds = 3600;
    const payload = "";
    if (appID && serverSecret && userId) {
      const token = generateToken04(
        appID,
        userId,
        serverSecret,
        effectiveTimeInSeconds,
        payload
      );
      res.status(200).json({ token });
    }
    return res
      .status(400)
      .send("User id, app id and server secret is required");
  } catch (err) {
    console.log({ err });
    next(err);
  }
};
