import React from "react";
import "./detail.css";
import { useUserStore } from "../../lib/userStore";
import { auth, db } from "../../lib/firebase";
import { usechatStore } from "../../lib/chatStore";
import { arrayRemove, arrayUnion, doc, updateDoc } from "firebase/firestore";

const Detail = () => {
    const { currentUser } = useUserStore();
    const { user, chatId, isCurrentUserBlocked, changeBlock, isReceiverBlocked } = usechatStore();

    const handleBlock = async () => {
        if (!user) return;

        const userDocRef = doc(db, "users", currentUser.id);
        try {

            await updateDoc(userDocRef, {
                blocked: isReceiverBlocked ? arrayRemove(user.id) : arrayUnion(user.id)
            });

            changeBlock();

        } catch (error) {
            console.log("error", error);

        }

    }

    return (
        <div className="detail">
            <div className="user">
                <img src={user?.avatar || "./avatar.png"} alt="" />
                <h2>{user?.username || "User"}</h2>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing.</p>
            </div>
            <div className="info">
                <div className="option">
                    <div className="title">
                        <span>Chat Setings</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Privacy & Help</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Photos</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                    <div className="photos">
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://th.bing.com/th/id/OIP.tLotgCDtzgTdwJcTiXWRCwHaEK?w=311&h=180&c=7&r=0&o=5&pid=1.7" alt="" />
                                <span>photoName.png</span>
                            </div>
                            <div className="icon">
                                <img src="./download.png" alt="" />
                            </div>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://th.bing.com/th/id/OIP.tLotgCDtzgTdwJcTiXWRCwHaEK?w=311&h=180&c=7&r=0&o=5&pid=1.7" alt="" />
                                <span>photoName.png</span>
                            </div>
                            <div className="icon">
                                <img src="./download.png" alt="" />
                            </div>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://th.bing.com/th/id/OIP.tLotgCDtzgTdwJcTiXWRCwHaEK?w=311&h=180&c=7&r=0&o=5&pid=1.7" alt="" />
                                <span>photoName.png</span>
                            </div>
                            <div className="icon">
                                <img src="./download.png" alt="" />
                            </div>
                        </div>
                        <div className="photoItem">
                            <div className="photoDetail">
                                <img src="https://th.bing.com/th/id/OIP.tLotgCDtzgTdwJcTiXWRCwHaEK?w=311&h=180&c=7&r=0&o=5&pid=1.7" alt="" />
                                <span>photoName.png</span>
                            </div>
                            <div className="icon">
                                <img src="./download.png" alt="" />
                            </div>
                        </div>


                    </div>
                </div>
                <div className="option">
                    <div className="title">
                        <span>Shared Files</span>
                        <img src="./arrowUp.png" alt="" />
                    </div>
                </div>

                <button onClick={handleBlock} >{isCurrentUserBlocked ? "You are Blocked" : isReceiverBlocked ? "User Blocked" : "Block User"}</button>
                <button className="logout" onClick={() => { auth.signOut(currentUser?.uid) }}>Logout</button>
            </div>
        </div>
    );
};

export default Detail;