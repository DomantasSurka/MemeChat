import React, {useRef, useState, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import { ChatEngine } from 'react-chat-engine';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Chats = () =>{

    const history = useHistory(); 
    const {user} = useAuth();
    const [loading, setLoading] = useState(true);

    const handleLogout = async() =>{
        await auth.signOut();
        history.push('/');
    }

    const getFile = async(url) =>{
        if(url == null){
            url = "https://lh3.googleusercontent.com/a-/AOh14GiyFGGBwvIZkGK2Tb1CcVDz88lW5crBGZX_SsgOUg=s96-c";
        }
        console.log("getting icon "+url);
        const response = await fetch(url);
        console.log("response");
        console.log(response);
        const data = await response.blob();
        return new File([data], "userPhoto.jpg", {type : 'image/jpeg'});
    }

    useEffect(()  => {
        if(!user){
            history.push('/');
            return;
        }
        let headersData = {
            "project-ID" : process.env.REACT_APP_CHAT_ENGINE_ID,
            "user-name" : user.email,
            "user-secret" : user.uid
        };
        console.log("getting user");

        var requestOptions = {
            method: 'GET',
            headers: headersData,
            //redirect: 'follow'
        };
        console.log(requestOptions);
        fetch("https://api.chatengine.io/users/me/", requestOptions)
        .then(res => {
            if(res.status == "403"){
                console.log("user didn't exist");
                let formdata = new FormData();
                formdata.append('email', user.email);
                formdata.append('username', user.email);
                formdata.append('secret', user.uid);
                getFile(user.photoURL)
                .then((avatar) =>{
                    formdata.append('avatar', avatar, avatar.name);

                    axios.post('https://api.chatengine.io/users',
                                formdata,
                                {headers : {"private-key" : process.env.REACT_APP_CHAT_ENGINE_KEY}}
                    )
                    .then(()=>setLoading(false))
                    .catch((error)=>console.log(error))
                })
            } else {
                setLoading(false);
            }
        }).catch(err=> {
            console.log("err");
            console.log(err);
        });
        // axios.get('https://api.chatengine.io/users/me',{
        //     headers :headersData
        // })
        // .then(() =>{
        //     setLoading(false);
        // })
        // .catch(() =>{
        //     console.log("user didn't exist");
        //     let formdata = new FormData();
        //     formdata.append('email', user.email);
        //     formdata.append('username', user.email);
        //     formdata.append('secret', user.uid);
        //     getFile(user.photoURL)
        //     .then((avatar) =>{
        //         formdata.append('avatar', avatar, avatar.name);

        //         axios.post('https://api.chatengine.io/users',
        //                     formdata,
        //                     {headers : {"private-key" : process.env.REACT_APP_CHAT_ENGINE_KEY}}
        //         )
        //         .then(()=>setLoading(false))
        //         .catch((error)=>console.log(error))
        //     })
        // })
    },[user,history]);

    if(!user || loading) return 'Loading...';

    return(
        <div className="chats-page">
            <div className="nav-bar">
                <div className="logo-tab">
                        MemeChat
                </div>
                <div onClick = {handleLogout} className="logout-tab">
                    Logout
                </div>
            </div>
            <ChatEngine
                height="calc(100vh - 66px)"
                projectID={process.env.REACT_APP_CHAT_ENGINE_ID}
                userName={user.email}
                userSecret={user.uid}
            />
        </div>
    );
}

export default Chats;