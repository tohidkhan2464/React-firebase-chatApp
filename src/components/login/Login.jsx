import React, { useState } from "react";
import './login.css'
import { toast } from "react-toastify";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/uploads";
import { useUserStore } from "../../lib/userStore";

const Login = () => {
    const [avatar, setAvatar] = useState({
        file: null,
        url: ""
    });
    const { fetchUserInfo } = useUserStore();

    const [loading, setLoading] = useState(false);

    const handleAvatar = (event) => {
        console.log("object", event);
        if (event.target.files[0]) {
            setAvatar({
                file: event.target.files[0],
                url: URL.createObjectURL(event.target.files[0])
            })
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);
        const { email, password } = Object.fromEntries(formData);

        try {
            await signInWithEmailAndPassword(auth, email, password);

            toast.success("Logged In successfully.")

        } catch (error) {
            console.log("Error", error);
            toast.success("Eror occured")

            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    const handleRegister = async (event) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData(event.target);
        const { username, email, password } = Object.fromEntries(formData);
        try {
            const res = await createUserWithEmailAndPassword(auth, email, password);
            console.log("result", res);
            const imgUrl = await upload(avatar.file);
            await setDoc(doc(db, "users", res.user.uid), {
                username,
                email,
                avatar: imgUrl,
                id: res.user.uid,
                blocked: [],
            });
            await setDoc(doc(db, "userchats", res.user.uid), {
                chats: [],
            });
            await fetchUserInfo(res.user.uid);
            toast.success("Account created successfully.")
        } catch (error) {
            console.log("error", error);
            setLoading(false);
            toast.success("Error occured.")

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="login">
            <div className="item">
                <h2>Welcome Back</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign In"}</button>
                </form>
            </div>
            <div className="seperator"></div>
            <div className="item">
                <h2>Create Account</h2>
                <form onSubmit={handleRegister} >

                    <label htmlFor="file">
                        <img src={avatar?.url || './avatar.png'} alt="" />
                        Upload an Image</label>
                    <input type="file" name="avatar" id="file" hidden onChange={handleAvatar} />
                    <input type="text" placeholder="Username" name="username" />
                    <input type="text" placeholder="Email" name="email" />
                    <input type="password" placeholder="Password" name="password" />
                    <button disabled={loading}>{loading ? "Loading..." : "Sign Up"}</button>
                </form>
            </div>
        </div>
    );
};

export default Login;