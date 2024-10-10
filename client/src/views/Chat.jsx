import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useContext } from "react";
import { themeContext } from "../context/ThemDark.jsx";
import React from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import EmojiPicker from "emoji-picker-react";
export const App = () => {
  const cld = new Cloudinary({ cloud: { cloudName: "dmar1b49z" } });

  // Use this sample image or upload your own via the Media Explorer
  const img = cld
    .image("cld-sample-5")
    .format("auto") // Optimize delivery by resizing and applying auto-format and auto-quality
    .quality("auto")
    .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio

  return <AdvancedImage cldImg={img} />;
};

export default function Chat({ socket, url }) {
  const [messageSent, setMessageSent] = useState("");
  const [room, setRoom] = useState([]);
  const [chats, setChats] = useState([]);
  const [roomId, setRoomId] = useState(0);
  const [roomName, setRoomName] = useState("");
  const bottomRef = useRef();
  const { currentTheme, theme, setCurrentTheme } = useContext(themeContext);
  const [selectedFile, setSelectedFile] = useState("");
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const navigate = useNavigate();
  function handleLogout() {
    localStorage.clear();
    navigate("/chat");
  }
  function handleEmojiClick(emojiObject, event) {
    setMessageSent((prev) => prev + emojiObject.emoji);
  }
  async function handleImg(roomId) {
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const { data } = await axios.post(`${url}/chat/img/${roomId}`, formData, {
        headers: { Authorization: `Bearer ${localStorage.username}` },
      });
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleDelRoom(roomId) {
    try {
      const { data } = await axios.delete(`${url}/room/del/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.username}` },
      });
      console.log(data);
      fetchRoom();
    } catch (error) {
      console.log(error);
    }
  }
  async function handleChat(roomId) {
    try {
      console.log(roomId);
      const { data } = await axios.get(`${url}/chat/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.username}` },
      });
      console.log(data);
      setChats(data);
      setMessageSent("");
      socket.emit("joinRoom", roomId);
    } catch (error) {
      console.log(error);
    }
  }
  async function roomDetail(roomId) {
    try {
      const { data } = await axios.get(`${url}/room/${roomId}`, {
        headers: { Authorization: `Bearer ${localStorage.username}` },
      });
      console.log(data);
      setRoomName(data.name);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleSubmit(e) {
    e.preventDefault();

    socket.emit("message:new", { message: messageSent, roomId });

    try {
      if (messageSent) {
        console.log("asdasd");

        const { data } = await axios.post(
          `${url}/chat/${roomId}`,
          { chat: messageSent },
          { headers: { Authorization: `Bearer ${localStorage.username}` } }
        );
      } else if (selectedFile) {
        console.log("aoshdjasbd");

        const { data } = await axios.post(
          `${url}/chat/${roomId}`,
          { chat: selectedFile.name },
          { headers: { Authorization: `Bearer ${localStorage.username}` } }
        );
      }
      handleChat(roomId);

      setMessageSent("");
    } catch (error) {
      console.log(error);
    }
  }
  async function fetchRoom() {
    try {
      const { data } = await axios.get(`${url}/room`, {
        headers: { Authorization: `Bearer ${localStorage.username}` },
      });
      setRoom(data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);
  useEffect(() => {
    socket.auth = {
      username: localStorage.username,
    };
    socket.connect();
    fetchRoom();
    socket.on("message:update", (newMessage) => {
      setMessageSent((current) => {
        return [...current, newMessage, handleChat(roomId)];
      });
      setMessageSent("");
    });

    return () => {
      socket.off("message:update");
      socket.disconnect();
    };
  }, [roomId]);
  return (
    <>
      <div data-theme={theme[currentTheme].dataTheme}>
        <div className="flex justify-between">
          <button className="flex justify-center bg-red-400 w-40 p-4 m-2 rounded-lg">
            <p className="font-bold" onClick={handleLogout}>
              Logout
            </p>
          </button>

          {currentTheme == "light" ? (
            <svg
              className="swap-on h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              onClick={() => setCurrentTheme("dark")}
            >
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>
          ) : (
            <svg
              className="swap-off h-10 w-10 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              onClick={() => setCurrentTheme("light")}
            >
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          )}
        </div>

        <div className="flex justify-between">
          <ul className="flex flex-col gap-5 pr-4 mt-5">
            {room.map((e, index) => (
              <li key={index}>
                <div className="flex">
                  <button
                    className="flex gap-4 border-b-2 pb-2"
                    onClick={() => {
                      {
                        return (
                          handleChat(e.id), setRoomId(e.id), roomDetail(e.id)
                        );
                      }
                    }}
                  >
                    <div className="avatar ml-4">
                      <div className="w-14 rounded-full">
                        <img
                          src="https://placehold.co/200x/ffa8e4/ffffff.svg?text=ʕ•́ᴥ•̀ʔ&font=Lato"
                          alt="Avatar"
                        />
                      </div>
                    </div>
                    <div className="flex text-slate-500 mt-1 flex-col">
                      <span>{e.name}</span>
                    </div>
                  </button>
                  <button
                    className="btn text-red-500 ml-4"
                    onClick={() => handleDelRoom(e.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            <button
              className="bg-green-700 p-4 ml-3 rounded-lg"
              onClick={() => navigate("/addRoom")}
            >
              Add Room
            </button>
          </ul>

          <div className="flex flex-col items-center justify-center w-screen min-h-screen bg-base-200 text-gray-800 p-10">
            <div className="flex flex-col flex-grow w-full max-w-xl bg-base-100 shadow-xl rounded-lg overflow-hidden">
              <div
                className={
                  currentTheme == "light"
                    ? "text-black flex justify-center p-4 font-bold text-3xl shadow-lg"
                    : "text-cyan-300 flex justify-center p-4 font-bold text-3xl shadow-lg"
                }
              >
                {roomName}
              </div>
              <div className="flex flex-col flex-grow h-0 p-4 overflow-auto space-y-4">
                {chats.map((msg) => {
                  return (
                    <div
                      key={msg.id}
                      className={
                        msg.User.username == localStorage.username
                          ? "chat chat-end flex flex-col items-end"
                          : "chat chat-start flex flex-col items-start"
                      }
                    >
                      <div className="text-sm text-gray-500">
                        {msg.User.username == localStorage.username
                          ? "You"
                          : msg.User.username}
                      </div>
                      <div className="chat-bubble chat-bubble-accent  text-black p-2 rounded-lg shadow">
                        {msg.chat}
                      </div>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>

              <form
                className="p-4 flex flex-row space-x-2"
                onSubmit={handleSubmit}
              >
                <button
                  style={{ fontSize: "20px", padding: "5px" }}
                  type="button" // Prevent form submission when clicking the emoji button
                  onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                >
                  😊
                </button>

                {emojiPickerVisible && (
                  <div
                    style={{
                      position: "absolute",
                      top: "40px",
                      left: "0",
                      zIndex: "10",
                      transform: "scale(0.8)",
                      backgroundColor: "white",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
                    }}
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}

                <input
                  onChange={(e) => setMessageSent(e.target.value)}
                  className={
                    currentTheme == "light"
                      ? "text-black flex items-center w-full rounded-lg px-3 py-2 bg-base-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                      : "text-white flex items-center w-full rounded-lg px-3 py-2 bg-base-100 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent"
                  }
                  type="text"
                  placeholder="Type your message…"
                  disabled={roomId == 0}
                  value={messageSent}
                />
                <button
                  className="btn btn-base-100 bg-primary text-black px-4 py-2 rounded-lg hover:bg-primary-focus"
                  type="submit"
                  disabled={roomId == 0}
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
