/*
Okay, imagine you're building a house with Lego blocks. You have different pieces like windows, doors, walls, and roofs, and you need to put them together in the right way to make the house look like you want it to.

In the same way, when you're building a web page or an app with React, you have different pieces of code that you need to put together to make it work. Sometimes you need to pass data between these pieces of code, like telling a button what to do when it's clicked.

The "createContext" function in React is like a special Lego piece that helps you share data between different parts of your app. It creates a "context" that you can use to pass information down from a parent component to its children.

For example, imagine you have a component that shows a list of items, and you want to give each item a unique ID. You can create a context for the ID and pass it down to each item in the list, so they all know what their ID is.

This makes it easy to share data between different parts of your app without having to pass it down through a bunch of different components. It's like having a secret code that all the different parts of your app can use to talk to each other!
*/
const { createContext, useState } = require("react");

export const UserContext=createContext({});

export function UserContextProvider({children}){
    const [userInfo,setUserInfo]=useState({});
    return (
        <UserContext.Provider value={{userInfo,setUserInfo}}>
            {children}
        </UserContext.Provider>
    )
}