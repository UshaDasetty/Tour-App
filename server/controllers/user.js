import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import UserModal from "../models/user.js";

const secret = "test";

/*********************************************************************************************/

// User Login or SignIn
export const signin = async (req, res) => {
  
    // Required fields to sign in
    const { email, password } = req.body;

    try {

      // It will Check whwther the User exist or not, If Not found it says User does'nt exist
      const oldUser = await UserModal.findOne({ email });
      if (!oldUser)
        return res.status(404).json({ message: "User doesn't exist" });

      // It will Compare the Bcrypted Old Password, if not correct it says Invalid credentials
      const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });

      // If both email & password are correct, then it will generates a token to login, expires in 1 hour
      const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
        expiresIn: "1h",
      });

      // sends User and token, after LoggedIn Successfully
      res.status(200).json({ result: oldUser, token });

    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
};

/*********************************************************************************************/

// User Registration or SignUp
export const signup = async (req, res) => {

    // Required fields to SignUp
    const { email, password, firstName, lastName } = req.body;

    try {

      // Check if the user is already signed up, if Exist it says Already Exist
      const oldUser = await UserModal.findOne({ email });
      if (oldUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Bcrypt the Password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Creates new User and Save it to the database
      const result = await UserModal.create({
        email,
        password: hashedPassword,
        name: `${firstName} ${lastName}`,
      });

      // Generates jwt token when User SignUp
      const token = jwt.sign({ email: result.email, id: result._id }, secret, {
        expiresIn: "1h",
      });

      // Sends Response and JWT token, after SignedUp Successfully
      res.status(201).json({ result, token });

    } catch (error) {
      res.status(500).json({ message: "Something went wrong" });
      console.log(error);
    }
};

/*********************************************************************************************/

// Google SignIn
export const googleSignIn = async (req, res) => {
  const { email, name, token, googleId } = req.body;

  try {

    // Checks for User In the Database, If User found it will send result and token
    const oldUser = await UserModal.findOne({ email });
    if (oldUser) {
      const result = { _id: oldUser._id.toString(), email, name };
      return res.status(200).json({ result, token });
    }

    // Save User to DataBase
    const result = await UserModal.create({
      email,
      name,
      googleId,
    });

    res.status(200).json({ result, token });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
    console.log(error);
  }
};

/*********************************************************************************************/