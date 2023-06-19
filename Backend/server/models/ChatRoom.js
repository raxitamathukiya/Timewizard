import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

export const CHAT_ROOM_TYPES = {
  CONSUMER_TO_CONSUMER: "consumer-to-consumer",
  CONSUMER_TO_SUPPORT: "consumer-to-support",
};

const chatRoomSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    userEmails: Array,
    type: String,
    chatInitiator: String,
  },
  {
    timestamps: true,
    collection: "chatrooms",
  }
);

/**
 * @param {String} userEmail - id of user
 * @return {Array} array of all chatroom that the user belongs to
 */
chatRoomSchema.statics.getChatRoomsByUserId = async function (userEmail) {
  try {
    const rooms = await this.find({ userEmails: { $all: [userEmail] } });
    return rooms;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {String} roomId - id of chatroom
 * @return {Object} chatroom
 */
chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
  try {
    const room = await this.findOne({ _id: roomId });
    return room;
  } catch (error) {
    throw error;
  }
}

/**
 * @param {Array} userEmails - array of strings of userEmails
 * @param {String} chatInitiator - user who initiated the chat
 * @param {CHAT_ROOM_TYPES} type
 */
chatRoomSchema.statics.initiateChat = async function (userEmails, type, chatInitiator) {
  try {
    const availableRoom = await this.findOne({
      userEmails: {
        $size: userEmails.length,
        $all: [...userEmails],
      },
      type,
    });
    if (availableRoom) {
      return {
        isNew: false,
        message: 'retrieving an old chat room',
        chatRoomId: availableRoom._doc._id,
        type: availableRoom._doc.type,
      };
    }

    const newRoom = await this.create({ userEmails, type, chatInitiator });
    return {
      isNew: true,
      message: 'creating a new chatroom',
      chatRoomId: newRoom._doc._id,
      type: newRoom._doc.type,
    };
  } catch (error) {
    console.log('error on start chat method', error);
    throw error;
  }
}

export default mongoose.model("ChatRoom", chatRoomSchema);
