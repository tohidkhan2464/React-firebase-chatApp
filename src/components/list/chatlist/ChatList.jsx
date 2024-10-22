import React, { useEffect } from "react";
import "./chatlist.css";
import AddUser from "./addUser/AddUser";
import { useUserStore } from "../../../lib/userStore";
import { doc, getDoc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { usechatStore } from "../../../lib/chatStore";

const ChatList = () => {
    const { currentUser } = useUserStore();
    const { changeChat } = usechatStore();

    const [addMode, setAddMode] = React.useState(false);
    const [input, setInput] = React.useState('');
    const [chats, setChats] = React.useState([]);

    useEffect(() => {
        const unSub = onSnapshot(doc(db, "userchats", currentUser?.id), async (res) => {
            const items = res.data().chats;

            console.log("object", res.data());
            const promises = items.map(async (item) => {
                const userDocRef = doc(db, "users", item.receiverId);
                const userDocSnap = await getDoc(userDocRef);

                const user = userDocSnap.data();

                return { ...item, user };
            });

            const chatData = await Promise.all(promises);

            setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));

        });

        return () => {
            unSub();
        };
    }, [currentUser.id])

    console.log("chats", chats);

    const handleSelect = async (chat) => {

        const userChats = chats.map((item) => {
            const { user, ...rest } = item;
            return rest;

        });
        const chatIndex = userChats.findIndex((item) => item.chatId === chat.chatId);
        userChats[chatIndex].isSeen = true;
        const userChatRef = doc(db, "userchats", currentUser.id);

        try {

            await updateDoc(userChatRef, {
                chats: userChats
            });
            changeChat(chat.chatId, chat.user);
        } catch (error) {
            console.log("error", error);
        }
    }

    const filteredChats = chats.filter((chat) => chat.user.username.toLowerCase().includes(input.toLowerCase()));

    return (
        <div className="chatlist">
            <div className="search">
                <div className="searchBar">
                    <img src="./search.png" alt="" className="img" />
                    <input type="text" placeholder="Search or start new chat" onChange={(e) => setInput(e.target.value)} />

                </div>
                <img src={addMode ? "./minus.png" : "./plus.png"} alt="" className="add"
                    onClick={() => setAddMode((prev) => !prev)} />
            </div>
            {
                filteredChats.map((chat) => (
                    <div className="item" key={chat?.chatId} onClick={() => handleSelect(chat)} >
                        <img src={chat.user.avatar || "./avatar.png"} alt="" />
                        <div className="texts">
                            <span>{chat.user.username}</span>
                            <p>{chat?.lastMessage}</p>
                        </div>
                        {!chat.isSeen && <div className="isSeen"></div>}
                    </div>
                ))
            }



            {addMode && <AddUser />}
        </div>
    );
};

export default ChatList;