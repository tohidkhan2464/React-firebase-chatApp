import React from "react";
import "./list.css";
import UnserInfo from "./userInfo/UserInfo";
import ChatList from "./chatlist/ChatList";

const List = () => {
    return (
        <div className="list">
            <UnserInfo/>
            <ChatList/>
        </div>
    );
};

export default List;