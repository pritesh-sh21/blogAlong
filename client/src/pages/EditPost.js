import React, { useState, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
    toolbar: [
        [{ 'header': [1, 2, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
        ['link', 'image'],
        ['clean']
    ],
};
const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
]

const EditPost = () => {
    //when we enter this editPost page we want to grab id from params;
    const { id } = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:4000/edit/${id}`)
            .then(response => {
                response.json().then(postInfo => {
                    setTitle(postInfo.title);
                    setContent(postInfo.content);
                    setSummary(postInfo.summary);
                })
            })
    }, [])

    async function updatePost(e) {
        e.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id',id);
        if (files[0]) {
            data.set('file', files[0]);
        }
        const response=await fetch('http://localhost:4000/post', {
            method: 'PUT', //update the page
            body: data,
            credentials:'include',
        })
        //after we updated the page, we wanna redirect to the post page we have edited i.e. /post/:id
        if(response.ok){
            setRedirect(true);
        }
    }

    // to redirect to home page if response is ok
    if (redirect) {
        return <Navigate to={`/post/${id}`} />
    }
    return (
        <form onSubmit={updatePost}>
            <input type="title"
                placeholder='title'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />
            <input type="Summary"
                placeholder='summary'
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
            />
            <input type="file"

                onChange={(e) => setFiles(e.target.files)}
            />
            <ReactQuill
                value={content}
                modules={modules}
                formats={formats}
                onChange={(newValue) => setContent(newValue)}
            />
            <button style={{ marginTop: '5px' }}>Update post</button>
        </form>
    )
}

export default EditPost