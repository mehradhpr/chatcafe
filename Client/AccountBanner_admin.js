import React from 'react';

function AccountBanner_admin({ id, nickname }) {

    function handleDeleteClick(e) {
        fetch(`http://localhost:8080/admin/deleteAccount/${id}`, {
            method: 'DELETE'
        })
            .then((response) => {
                if (response.ok) {
                    alert("Account Deleted");
                    window.location.reload()
                }
                else {
                    alert("Error Deleting the Account")
                }
            })
    }

    return (
        <div className='ChannelB'>
            <p>Username: {id} | Nickname: {nickname}</p>
            <button onClick={handleDeleteClick} className='delete-button'>Delete</button>
        </div>

    );
}

export default AccountBanner_admin;