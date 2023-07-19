import React from 'react'
import ChannelBanner_admin from './ChannelBanner_admin';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';


export default function Channels_admin() {
    const [getName, setName] = useState('');
    const [getDes, setDes] = useState('');
    const [channels, setChannels] = useState([]);

    useEffect(() => {
        // Fetch the list of channels from your server when the component is mounted
        fetch("http://localhost:8080/Channels")
            .then((response) => response.json())
            .then((data) => setChannels(data))
            .catch((error) => console.error("Error fetching channels:", error));
    }, []);

    const handle_createChannel_click = (e) => {
        e.preventDefault();
        fetch("http://localhost:8080/createChannel", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                created_by: "admin",
                name: getName,
                des: getDes
            }),
        })
            .then((response) => {
                if (response.ok) {
                    alert("Channel Created Successfully");

                    // Fetch the new channel's ID
                    return response.json();
                } else {
                    alert("Error Creating Channel");
                    throw new Error("Error Creating Channel");
                }
            })
            .then(({ id }) => {
                // Fetch the new channel object by its ID
                return fetch(`http://localhost:8080/channel/${id}`).then((response) =>
                    response.json()
                );
            })
            .then((newChannel) => {
                // Update the channels state with the new channel
                setChannels((prevChannels) => [...prevChannels, newChannel]);
            })
            .catch((error) => {
                console.error("Error creating channel:", error);
                alert("Error creating channel");
            });
    };

    return (
        <div className="float-container">
            <div className='userInfo'>
                <p>Admin With Full Access <Link to="/admin/allAccounts" className='AccountsB'>All Accounts</Link> 
                <Link to="/admin/find" className='AccountsB'>Find</Link>
                <Link to={`/`} className='AccountsB'>Log Out</Link></p>
                
            </div>
            <div className="ChannelsList">
                <h2>Active Channels</h2>
                {channels.map((channel) => (
                    <ChannelBanner_admin id={channel.id} name={channel.name} description={channel.description}  />
                ))}
            </div>
            <div className="ChannelCreation">
                <h2>Create a New Channel</h2>
                <form>
                    <label>Name</label>
                    <input type="text" onChange={e => setName(e.target.value)} /><br />
                    <label>Description</label>
                    <input type="text" onChange={e => setDes(e.target.value)} /><br />
                    <input type="submit" className='createChannelB' value="Create"
                        onClick={handle_createChannel_click}
                    />
                </form>
            </div>
        </div>
    )
}