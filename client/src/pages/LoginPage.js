import React, { useContext, useState } from 'react';
import {Navigate} from 'react-router-dom';
import { UserContext } from '../UserContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const {setUserInfo}=useContext(UserContext);

    async function login(e) {
        e.preventDefault();
        const response = await fetch('http://localhost:4000/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-type': 'application/json' },
            //now to save the cookie sent in response to our login request and that cookie contains jwt tokens created of the user
            // res.cookie('token',token).json('ok');
            credentials: 'include'
            //now our request header also contains cookie that is sent by our server
        });
        // if response is ok then we want to say login is succcessful and make user redirect to home page
        // in response we get data sent from our server at /login route i.e res.cookie('token', token).json({ id:userDoc._id,usernam});
        if (response.ok) {
            response.json().then(userInfo=>{
                setUserInfo(userInfo)
                setRedirect(true);
            })
        }else{
            alert('wrong credentials')
        }
    }

    if(redirect){
        return <Navigate to={'/'}/>
    }
    return (
        <form className='login' onSubmit={login}>
            <h1>Login</h1>
            <input type="text"
                placeholder='username'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input type="password"
                placeholder='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button>Login</button>
        </form>
    )
}

export default LoginPage