import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Posts.css";
import { Link } from "react-router-dom";

const Posts = () => {
  // const posts = [];
  const [posts, setPosts] = useState([]);
  const url = `${import.meta.env.VITE_API_ROOT}/posts`;
  useEffect(() => {
    axios
      .get(url)
      .then((res) => setPosts(res.data))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      {Object.keys(posts).length ? (
        <div className="post-container">
          {posts.map((post) => {
            console.log(post.title.rendered);
            return (
              <Link
                to={`/posts/${post.id}`}
                key={post.id}
                className="post-card"
              >
                {/* <div key={post.id} className="post-card"> */}
                <img src={post.featured_src} alt={post.title.rendered} className="post-img" />
                <h2 className="post-title">{post.title.rendered}</h2>
                <p
                  className="post-details"
                  dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
                ></p>
                {/* </div> */}
              </Link>
            );
          })}
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};

export default Posts;
