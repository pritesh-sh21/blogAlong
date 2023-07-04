import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from './UserContext';

const Header = () => {
  const { setUserInfo, userInfo } = useContext(UserContext)

  // the useEffect hook is used to fetch data from an API when the component is first rendered. The [] dependency array tells React that the effect should only be run once, when the component is first mounted. The fetched data is stored in state, which is used to render the UI.
  useEffect(() => {
    // so what is happening here? whenever this component renders, the fetch function will make a get request on passed in url and in response to this url our server will respond
    fetch('http://localhost:4000/profile', {
      credentials: 'include',
    }).then(response => {  //decoded info returned from /profile in our server will be in this parameter
      response.json().then(userInfo => {
        setUserInfo(userInfo.username);
      })
    })
  }, [])

  // handling logout functionality : we want to invalidate the cookie, we can either reset the cookie on frontend part or we can do with this backend(we will do it in backend using fetch)
  function logOut() {
    fetch('http://localhost:4000/logout', {
      method: 'POST',
      credentials: 'include'
    })
    setUserInfo(null); //this resets the navbar to login tabs
  }
  const username = userInfo?.username;

  return (
    <header>
      <Link to="/" className="logo">Blog Along</Link>
      <nav>
        {username && (
          <>
            <span>Hello, {username}</span>
            <Link to="/create" >Create new post</Link>
            <a onClick={logOut}>Logout</a>

          </>
        )}
        {!username && (
          <>
            <Link to="/login">LogIn</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </nav>
    </header>
  )
}

export default Header