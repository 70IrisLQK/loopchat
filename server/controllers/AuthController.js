import User from "../models/UserModel.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import { ImageKitConfig } from "../config/ImageKitConfig.js";
import { Readable } from "stream";

const maxAge = 365 * 24 * 60 * 60 * 1000; // Token expiration in seconds

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};

export const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    const oldUser = await User.findOne({ email: email });

    if (oldUser) {
      return res.status(400).send("Email is existed. Please try again.");
    }

    // Create user
    const user = await User.create({ email, password });

    // Set cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge, // Convert to milliseconds
      secure: true,
      sameSite: "None",
    });

    // Send response
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).send("Email and password are required");
    }

    // Create user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).send("user not found!");
    }

    const auth = await compare(password, user.password);

    if (!auth) {
      return res.status(400).send("password is incorrect");
    }

    // Set cookie
    res.cookie("jwt", createToken(email, user.id), {
      maxAge, // Convert to milliseconds
      secure: true,
      sameSite: "None",
    });

    // Send response
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getUserInfo = async (req, res, next) => {
  try {
    const userData = await User.findById(req.userId);

    if (!userData) {
      return res.status(404).send("User with given id not found !");
    }

    // Send response
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName) {
      return res
        .status(400)
        .send("first name last name and color is required!");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        color,
        profileSetup: true,
      },
      { new: true, runValidators: true }
    );
    // Send response
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const addProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("file is required");
    }
    const typeImage = req.file.originalname.split(".")[1];
    if (typeImage !== "jpg" && typeImage !== "png" && typeImage !== "jpeg") {
      return res
        .status(400)
        .send(
          "Format file error. Please input correct format [jpg, png, jpeg]"
        );
    }
    // Create a readable stream from the file buffer
    const uploadStream = new Readable();
    uploadStream.push(req.file.buffer);
    uploadStream.push(null);

    // ImageKitConfig upload parameters
    const uploadParams = {
      file: uploadStream,
      fileName: req.file.originalname,
    };
    // Upload file to ImageKitConfig
    ImageKitConfig.upload(uploadParams, async (error, result) => {
      if (error) {
        return res.status(500).send("Error uploading file to ImageKit.");
      }
      const updatedUser = await User.findByIdAndUpdate(
        req.userId,
        { image: result.url },
        { new: true, runValidators: true }
      );

      // Return the URL of the uploaded file
      return res.status(200).json({
        image: updatedUser.image,
      });
    });

    // Send response
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const removeProfileImage = async (req, res, next) => {
  try {
    const { userId } = req;
    const user = await User.findById(userId);

    user.image = null;
    await user.save();
    if (!user) {
      return res.status(404).send("User not found !");
    }

    // Send response
    return res.status(200).send("Profile image deleted successfully!");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const logout = async (req, res, next) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    // Send response
    return res.status(200).send("Logout Successfully!");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
