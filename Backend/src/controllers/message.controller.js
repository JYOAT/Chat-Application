import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUser = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUser } }).select("-password");
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in filteredUsers", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: senderId }
            ]
        })
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error in getMessage controller", error.message);
        res.status(500).json({ error: "Internal server error" });

    }

}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })
        await newMessage.save();
        //todo


        res.status(200).json(newMessage);
    } catch (error) {
        console.error("Error in sendMessage controller", error.message);
        res.status(500).json({ error: "Internal server error" });


    }

}