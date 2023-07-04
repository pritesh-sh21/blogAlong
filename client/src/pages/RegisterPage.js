import React, { useState } from 'react'

const RegisterPage = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('');
    const register = async (e) => {
        e.preventDefault();
        // fetch() function to send a POST request to http://localhost:4000 with some options specified in an object.
        // fetch() allows the same functionalities as axios library
        // The await keyword is used to pause the execution of the function until the Promise returned by fetch() is resolved. This is useful if we want to wait for the response from the server before continuing with the rest of our code.
        const response=await fetch('http://localhost:4000/register', {
            method: 'POST', // Set the HTTP method to POST
            body: JSON.stringify({ username, password }), // Set the request body to a JSON-encoded object containing username and password
            headers: { 'Content-type': 'application/json' } // Set the Content-Type header to indicate that the request body is JSON
        });
        if(response.status===200){
            alert('registration successful')
        }else{
            alert('registration failed');
        }
    }
    
    return (
        <form className='register' onSubmit={register} >
            <h1>Register</h1>
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
            <button>Register</button>
        </form>
    )
}


export default RegisterPage