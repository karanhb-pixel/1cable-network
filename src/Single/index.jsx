import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useEffect,useState } from 'react';
import './single.css';
const Single = () => {
    const {id} = useParams();   
    const [post,setPost] = useState({});
    useEffect(()=>{
        let url = `${import.meta.env.VITE_API_ROOT}/posts/${id}`;
        axios.get(url).then(res=>{
            // console.log('res',res);
            setPost(res.data);
        }).catch(err=>console.log('error',err.message));
    },[]);
  return (
    <>
        {
            Object.keys(post).length ? (
                <div className='single-post'>
                    <h1 className='single-post-title'>{post.title.rendered}</h1>
                    <img src={post.featured_src} alt={post.title.rendered} className='single-post-img' />
                    <p dangerouslySetInnerHTML={{ __html: post.content.rendered}} className='single-post-content'></p>
                </div> 
            )
            : "Loading..."
        }
    </>
  )
}

export default Single;