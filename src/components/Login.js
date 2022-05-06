import React, {useRef} from 'react';
import {GoogleOutlined, FacebookOutlined} from '@ant-design/icons';
import "firebase/app";
import { auth } from '../firebase';
import firebase from 'firebase/app';
import '../index.css';

const Login = () =>{
    const emailref = useRef(null);
    const passwordref = useRef(null);
    const signup = e => {
        e.preventDefault();
        console.log("e: ");
        console.log(e);
        auth.createUserWithEmailAndPassword(emailref.current.value, passwordref.current.value)
        .then(u => {
            console.log(u);
        }).catch((err)=>{
            console.log(err);
        });
    }

    const signin = e => {
        e.preventDefault();
        auth.signInWithEmailAndPassword(emailref.current.value, passwordref.current.value)
        .then(u => {
            console.log(u);
        }).catch((err)=>{
            console.log(err);
        });
    }

    return(
        <div id="login-page">
            <div id="login-card">
                <img src="https://media.discordapp.net/attachments/949751686824591471/955505978286157934/Screenshot_2022-03-21_at_18.38.36.png"/>
                <div className='signin'>
                    <form action=''>
                        <input ref={emailref} type="email" placeholder='email'/>
                        <input ref={passwordref} type="password" placeholder='password'/>
                        <button onClick={signin}>Login</button>
                        <h6>Don't have an account? <span onClick={signup} className='signup-link'>Register</span></h6>
                    </form>
                </div>
                <div className="login-button google"
                onClick= {() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}
                >
                
                <GoogleOutlined/> Login with Google
                </div>
            </div>
        </div>
    );
}

export default Login;
