import React from "react";
import "./userInfo.css";
import { useUserStore } from "../../../lib/userStore";

const UnserInfo = () => {
  const { currentUser } = useUserStore();

  return (
    <div className="userinfo">
      <div className="user">
        <img src={currentUser?.avatar || "./avatar.png"} className="img" />
        <h2>{currentUser?.username}</h2>
      </div>
      <div className="icons">
        <img src="./more.png" alt="" className="img" />
        <img src="video.png" alt="" className="img" />
        <img src="edit.png" alt="" className="img" />
      </div>
    </div>
  );
};

export default UnserInfo;