// ChannelPage.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Message from './Message';
import Message_admin from './Message_admin';

function ChannelPage() {
    const { accountInfo, channelInfo } = useParams();
    var address = '/admin/';
    var username = '';
    var nickname = '';
    if (accountInfo === undefined) {
        username = 'admin';
        nickname = 'admin';
    }
    else {
        const account = JSON.parse(decodeURIComponent(accountInfo));
        username = account.username;
        nickname = account.nickname;
        address = `/user/${accountInfo}`
    }

    const channel = JSON.parse(decodeURIComponent(channelInfo));
    const { ChannelID, ChannelName, ChannelDesc } = channel;

    const [messages, setMessages] = useState([]);
    const [nm, setnm] = useState(0)
    const [newMessage, setNewMessage] = useState('');

    // run this when the number of messages change
    useEffect(() => {
        // Fetch the messages from your server when the component is mounted
        fetch(`http://localhost:8080/user/${username}/channel/${ChannelID}/messages/`)
            .then((response) =>
                response.json())
            .then((data) => {
                setMessages(data)
            })
            .catch((error) => console.error("Error fetching channels:", error));
    }, );

    const handleSendReply = (dest_id) => {
        if (newMessage.trim()) {
          fetch(`http://localhost:8080/user/${username}/channel/${ChannelID}/messages/newReply`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              content: newMessage,
              nickname: nickname,
              dest_id
            })
          })
            .then((response) => {
              if (response.ok) {
                setnm({nm} + 1);
                alert("Reply Sent");
              } else {
                alert("Error sending the Reply");
              }
            })
        }
      };

    const handleNewMessageChange = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = async (event) => {
        if (newMessage.trim()) {
            // Send the new message to the server
            const response = await fetch(`http://localhost:8080/user/${username}/channel/${ChannelID}/messages/newMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: newMessage,
                    nickname: nickname
                })
            });

            if (response.ok) {
                // Update the local messages state only after the server has successfully saved the new message
                setnm({nm} + 1);
                alert("Message Sent");
            } else {
                alert("Error sending the message");
            }
        }

        setNewMessage('');
    };

    return (
        <>
            <h2>{ChannelName}</h2>
            <p>{ChannelDesc}</p>
            <div className="channel-page">
                <div className="channel-box">
                    {messages.length === 0 ? (
                        <div className="empty-message-box">No messages in this channel.</div>
                    ) : (
                        messages.map((m) => {
                            if (username === 'admin') {
                                return (
                                    <Message_admin nickname={m.nickname} content={m.content} account_id={m.account_id} channel_id={m.channel_id} id={m.id} handleReplyClick={handleSendReply} reply_id={m.dest_id} />
                                )
                            }
                            else {
                                return (
                                    <Message nickname={m.nickname} content={m.content} account_id={m.account_id} channel_id={m.channel_id} id={m.id} handleReplyClick={handleSendReply} reply_id={m.dest_id} />
                                    )
                            }
                        })
                    )}
                </div>
                <div className="input-area">
                    <input
                        type="text"
                        s onChange={handleNewMessageChange}
                        placeholder="Type your message here..."
                    />
                    <button onClick={handleSendMessage}>Send</button>
                    <Link to={address} className='AccountsB'>Back</Link>
                </div>
            </div>
        </>

    );

}


export default ChannelPage;
