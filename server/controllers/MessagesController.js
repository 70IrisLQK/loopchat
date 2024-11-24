import Message from "../models/MessagesModel.js";
import { Readable } from "stream";
import { ImageKitConfig } from "../config/ImageKitConfig.js";

export const getMessages = async (req, res) => {
  try {
    const user1 = req.userId;
    const user2 = req.body.id;

    if (!user1 || !user2) {
      return res.status(400).send("Both user id are required");
    }

    const messages = await Message.find({
      $or: [
        { sender: user1, recipient: user2 },
        { sender: user2, recipient: user1 },
      ],
    }).sort({ timestamp: 1 });
    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).send("Internal Server Error");
  }
};

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required");
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
    ImageKitConfig.upload(uploadParams, (error, result) => {
      if (error) {
        console.error("Error uploading file to ImageKit:", error);
        return res.status(500).send("Error uploading file to ImageKit.");
      }

      // Return the URL of the uploaded file
      return res.status(200).json({ filePath: result.url });
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).send("Internal Server Error");
  }
};
