import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
// import { Button, Form } from "react-bootstrap";
import "./Profile.css";
// const uploadCloud = require("../cloudinary");

const Profile = props => {
  const [user, setUser] = useState(props.user);
  const [editForm, setEditForm] = useState(false);
  const [quote, setQuote] = useState("");
  const [messages, setMessages] = useState(null);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [upload, setUpload] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [submitButton, setSubmitButton] = useState(false);
  // console.log("props params:", props.match.params);

  // console.log("user props", props.user);
  const { id } = props.match.params;
  console.log(user.username);
  // first mount

  useEffect(() => {
    if (id != user._id) {
      updateData(id);
    } else {
      return;
    }
  });

  const updateData = id => {
    axios
      .get(`/profile/${id}`)
      .then(response => {
        setUser(response.data.user);
        setImage(response.data.user.image);
        setMessages(response.data.messages);
        console.log("USER RESPONSE", response.data.user.username);
      })
      .catch(err => {
        if (err.response.status === 404) {
          console.log(err);
          setError(err.response.data.message);
        }
      });
  };

  useEffect(() => {
    updateData(id);
    // console.log("did mount");
    // console.log("HALLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO", id);
  }, []);

  useEffect(() => {
    // console.log("imageChanged");
  }, [image]);

  useEffect(() => {
    // console.log("quote Changed");
  }, [quote]);

  useEffect(() => {
    // console.log("editform Changed");
  }, [editForm]);

  useEffect(() => {
    // console.log("upload changed");
  }, [upload]);

  useEffect(() => {
    // console.log("mounted or updated");
  }, []);

  // edit form should pops up when button is clicked
  const toggleEditForm = () => {
    setEditForm(!editForm);
  };

  const handleChange = event => {
    setQuote(event.target.value);
    setSubmitButton(true);
  };

  const handleUpload = event => {
    setUpload(true);

    const uploadData = new FormData();
    uploadData.append("image", event.target.files[0]);
    axios
      .post("/upload", uploadData)
      .then(response => {
        console.log(response.data);
        const image = response.data.secure_url;
        setImage(image);
        setUpload(false);
        setUploaded(true);
      })
      .catch(err => {
        console.log(err);
      });
  };

  const handleSubmit = event => {
    event.preventDefault();
    axios
      .put(`/profile/${id}`, { quote, image })
      .then(response => {
        setUser(response.data);
        setImage(image);
        console.log(setUploaded);
        setQuote(response.data.quote);
        setEditForm(false);
      })
      .catch(err => {
        console.log(err);
      });
  };

  let canUpdate = false;
  if (user._id === props.user._id) {
    canUpdate = true;
  }

  console.log("USAR", user);

  const imageStyle = {
      width: "80px",
      height: "80px",
      backgroundImage: `url(${user.image})`,
      backgroundSize: "cover",
      borderRadius: "50%"
    }
  
  

  return (
    <div className="profile-page" id="section1">
      <div className="profile">
        <h1>Profile</h1>
        <div style={imageStyle}>
        </div>
        <h2>{user.username}</h2>
        <p>
          Connected since{" "}
          {user.created_at.slice(5, 7) + "|" + user.created_at.slice(0, 4)}
        </p>
        {/* <h5>so far {messages} messages sent</h5> */}
        {user.quote && <h5>"{user.quote}"</h5>}
        {canUpdate && (
          <>
            <div Button>
              <a href="#section2">
                <button
                  className="main-cta orange-gradient shadow"
                  onClick={toggleEditForm}
                >
                  EDIT PROFILE
                </button>
              </a>
            </div>
          </>
        )}
      </div>
      <div className="edit-profile" id="section2">
        {editForm && (
          <form className="form-quote" onSubmit={handleSubmit}>
            <div className="input-container">
              {user.quote ? (
                <label htmlFor="quote">Edit quote</label>
              ) : (
                <label htmlFor="quote">Add quote</label>
              )}
              <input
                type="text"
                name="quote"
                value={quote}
                onChange={handleChange}
              />
            </div>
            {submitButton && <button type="submit">UPDATE</button>}
          </form>
        )}
        {upload && (
          <div className="loadingio-spinner-spinner-8gmk4npur0m">
            <div className="ldio-utk0u7ye5gr">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        )}
        {!upload && (
          <div>
            {editForm && (
              <form className="form-image" onSubmit={handleSubmit}>
                <div className="input-container">
                  <label htmlFor="image">Edit profile picture </label>
                  <input
                    type="file"
                    name="image"
                    id="image"
                    onChange={handleUpload}
                  />
                </div>
                <a href="#section1">
                  <button
                    className="main-cta orange-gradient shadow"
                    type="submit"
                  >
                    Submit
                  </button>
                </a>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
