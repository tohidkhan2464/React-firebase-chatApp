import { useEffect } from "react";
import Chat from "./components/chat/chat"
import Detail from "./components/detail/detail"
import List from "./components/list/list"
import Login from "./components/login/Login";
import Notification from "./components/notifications/notification";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useUserStore } from "./lib/userStore";
import { usechatStore } from "./lib/chatStore";

const App = () => {

  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  const { chatId } = usechatStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });

    return () => {
      unsub();
    };
  }, [fetchUserInfo]);

  console.log("currentUser", currentUser);
  if (isLoading) return <div className="loading">Loading...</div>

  return (
    <div className='container'>
      {
        currentUser ? (
          <>
            <List />
            {chatId && <Chat />}
            {chatId && <Detail />}
          </>
        ) : (
          <Login />
        )
      }
      <Notification />
    </div>
  )
}

export default App