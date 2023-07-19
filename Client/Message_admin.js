import React from "react";
import { useState, useEffect } from 'react';

function Message_admin({ nickname, content, accountID, channelID, id, handleReplyClick, reply_id }) {
    const [likes, setLikes] = useState()
    const [dislikes, setDislikes] = useState()

    // to refresh the like/dislike value each time their values change
    useEffect(() => {
        updateRatings();
    }, [likes, dislikes]);

    function updateRatings() {
        fetch(`http://localhost:8080/user/admin/channel/${channelID}/message/${id}/rating`, { method: 'GET' })
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                setLikes(data.likes)
                setDislikes(data.dislikes)
            })
            .catch((error) => alert(error));
    }

    function handleLikeClick(e) {
        setLikes(likes + 1);
        fetch(`http://localhost:8080/user/admin/channel/${channelID}/message/${id}/like`, {
            method: 'POST'
        })
    }

    function handleDislikeClick(e) {
        setDislikes(dislikes + 1);
        fetch(`http://localhost:8080/user/admin/channel/${channelID}/message/${id}/dislike`, {
            method: 'POST'
        })
    }

    function handleDeleteClick(e) {
        fetch(`http://localhost:8080/admin/deleteMessage/${id}`, {
            method: 'DELETE'
        }).then((response) => {
            window.location.reload();
        })
    }

    function handleReplyClickWrapper(e) {
        handleReplyClick(id);
    }

    var reply = "";
    if (reply_id !== null) reply = ` | Replied to ${reply_id}`;

    return (
        <div className="message">
            <div className="nickname">{nickname} | {id} {reply}</div>
            <div className="content">{content}</div>
            <button className="like-button" onClick={handleLikeClick}>{likes} Like</button>
            <button className="dislike-button" onClick={handleDislikeClick}>{dislikes} Dislike</button>
            <button className="reply-button" onClick={handleReplyClickWrapper}>Reply</button>
            <button onClick={handleDeleteClick} className="delete-button">Delete</button>
        </div>
    )
}

export default Message_admin;
