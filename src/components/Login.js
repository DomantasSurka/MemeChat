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
                <h1>Welcome to MemeChat!</h1>
                <div className='signin'>
                    <form action=''>
                        <h1>Sign in</h1>
                        <input ref={emailref} type="email" placeholder='email'/>
                        <input ref={passwordref} type="password" placeholder='password'/>
                        <button onClick={signin}>Sign in</button>
                        <h6>Don't have an account? <span onClick={signup} className='signup-link'>Register</span></h6>
                    </form>
                </div>
                <div className="login-button google"
                onClick= {() => auth.signInWithRedirect(new firebase.auth.GoogleAuthProvider())}
                >
                
                <GoogleOutlined/> Sign in with Google
                </div>
            </div>
        </div>
    );
}

export default Login;