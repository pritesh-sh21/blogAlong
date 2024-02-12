import React, { useEffect ,useState} from 'react'
import Post from '../post'

const IndexPage = () => {
  //when we  mount our homepage, we want to run this function
  const [posts,setPosts]= useState({});
  useEffect(() => {
    fetch('https://blog-along.vercel.app/post').then(response => {
      response.json().then(posts => {
        console.log(posts);
        setPosts(posts);
      }) 
    })
  }, [])

  return (
    <>
      {posts.length>0 && posts.map(post=>(
        <Post {...post}/> //passing post as props which contains data about post i.e. title,summary,contnet,cover
      ))}
    </>
  )
}

export default IndexPage
