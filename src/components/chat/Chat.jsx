import React, { useEffect, useRef } from "react";
import "./chat.css";
import EmojiPicker from "emoji-picker-react";
import { useUserStore } from "../../lib/userStore";
import { arrayUnion, doc, getDoc, getDocs, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { usechatStore } from "../../lib/chatStore";
import upload from "../../lib/uploads";

const Chat = () => {
    const { currentUser } = useUserStore();
    const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } = usechatStore();

    const [openEmoji, setOpenEmoji] = React.useState(false);
    const [text, setText] = React.useState("");
    const [img, setImg] = React.useState({ file: null, url: "" });
    const [chat, setChat] = React.useState({ messages: [] });
    console.log("chat", chat);
    const endRef = useRef(null);
    useEffect(() => {
        if (endRef.current) {
            endRef.current.scrollIntoView({ block: "end", inline: "nearest", behavior: "instant" });
        }
    }, [chat?.messages, chatId, img]);

    const handleEmoji = (event) => {
        console.log(event);
        setText((prev) => prev + event.emoji);
    }

    const handleImg = (event) => {
        console.log("object", event);
        if (event.target.files[0]) {
            setImg({
                file: event.target.files[0],
                url: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
            setChat(res.data());
        });
        return () => {
            unSub();
        };
    }, [chatId]);

    const handleSend = async () => {

        if (text === "") return;

        let imgUrl = null;

        try {

            if (img.file) {
                imgUrl = await upload(img.file);
                setImg({ file: null, url: "" });
            }

            await updateDoc(doc(db, "chats", chatId), {
                messages: arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && { img: imgUrl }),
                })
            });

            const userIDs = [currentUser.id, user.id];
            userIDs.forEach(async (id) => {
                const userChatRef = doc(db, 'userchats', id);
                const userChatSnap = await getDoc(userChatRef);

                if (userChatSnap.exists()) {
                    const userChatData = userChatSnap.data();

                    const chatIndex = userChatData.chats.findIndex((chat) => chat.chatId === chatId);
                    userChatData.chats[chatIndex].lastMessage = text;
                    userChatData.chats[chatIndex].isSeen = id === currentUser.id ? true : false;
                    userChatData.chats[chatIndex].updatedAt = Date.now();

                    await updateDoc(userChatRef, {
                        chats: userChatData.chats,
                    });
                }
            });

        } catch (error) {
            console.log(error);
        }
        setImg({ file: null, url: "" });
        setText("");
    };

    return (
        <div className="chat">
            <div className="top">
                <div className="user">
                    <img src={user?.avatar || "./avatar.png"} alt="" />
                    <div className="texts">
                        <span>{user?.username || "User"}</span>
                        <p>Lorem ipsum dolor s?</p>
                    </div>
                </div>
                <div className="icons">
                    <img src="./phone.png" alt="" />
                    <img src="./video.png" alt="" />
                    <img src="./info.png" alt="" />
                </div>
            </div>
            <div className="center">
                {chat?.messages.map((message) => (
                    <div className={message.senderId === currentUser.id ? "message own" : "message"} key={message.createdAt}>
                        <div className="texts">
                            {message.img && <img src={message.img} alt="" />}
                            <p>{message.text}</p>
                            <span>
                                {message.createdAt.toDate().toLocaleTimeString()}
                            </span>
                        </div>
                    </div>
                ))}
                {img.url && <div className="message own">
                    <div className="texts">
                        <img src={img.url} alt="" />
                    </div>
                </div>}
                <div ref={endRef}></div>
            </div>
            <div className="bottom">
                <div className="icons">
                    <label htmlFor="file">
                        <img src="./img.png" alt="" />
                    </label>
                    <input type="file" name="file" id="file"
                        disabled={isCurrentUserBlocked || isReceiverBlocked}
                        hidden onChange={handleImg} />
                    <img src="./camera.png" alt="" />
                    <img src="./mic.png" alt="" />
                </div>
                <input type="text" placeholder={(isCurrentUserBlocked || isReceiverBlocked) ? "You cannot send a message" : "Type a message..."}
                    value={text}
                    disabled={isCurrentUserBlocked || isReceiverBlocked}
                    onChange={(e) => setText(e.target.value)} />
                <div className="emoji">
                    <img src="./emoji.png" alt=""
                        onClick={() => setOpenEmoji((prev) => !prev)} />
                    <div className="picker">
                        <EmojiPicker open={openEmoji} onEmojiClick={handleEmoji} />
                    </div>
                </div>
                <button className="sendButton" onClick={handleSend} disabled={isCurrentUserBlocked || isReceiverBlocked}>Send</button>
            </div>
        </div>
    );
};

export default Chat;