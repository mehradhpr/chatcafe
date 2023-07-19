import React from 'react';
import { Link } from 'react-router-dom';

function ChannelBanner_admin({ id, name, description }) {

    const channelInfo = JSON.stringify({
        ChannelID: id,
        ChannelName: name,
        ChannelDesc: description
    });

    function handleDeleteClick(e) {
        fetch(`http://localhost:8080/admin/deleteChannel/${id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.ok) {
                    alert("Channel Deleted");
                    window.location.reload()
                }
                else {
                    alert("Error Deleting the Channel")
                }
            })
    }

    return (
        <div className="ChannelB">
            <Link to={{
                pathname: `/admin/channel/${channelInfo}`,
            }} className="link-unstyled">
                <p className='channelBannerT'>{name}</p><p>{description}</p>
            </Link>
            <button onClick={handleDeleteClick} className='delete-button'>Delete</button>
        </div>
    );
}

export default ChannelBanner_admin;
