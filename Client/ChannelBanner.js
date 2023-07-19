import React from 'react';
import { Link } from 'react-router-dom';

function ChannelBanner({ id, name, description }) {

    const channelInfo = JSON.stringify({
        ChannelID: id,
        ChannelName: name,
        ChannelDesc: description
    })

    return (
        <div className="ChannelB">
            <Link to={{
                pathname: `channel/${channelInfo}`,
            }} className="link-unstyled">
                <p className='channelBannerT'>{name}</p><p>{description}</p>
            </Link>
        </div>
    );
}

export default ChannelBanner;