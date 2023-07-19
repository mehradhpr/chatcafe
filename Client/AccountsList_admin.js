import React from 'react';
import { useState, useEffect, useRef } from 'react';
import AccountBanner_admin from './AccountBanner_admin';
import { useNavigate } from 'react-router-dom';

// assuming that accounts is an array of all the accounts
export default function AccountsList_admin() {
    const navigate = useNavigate()
    const [accounts, setAccounts] = useState([]);


    useEffect(() => {
        // Fetch the list of accounts from your server when the component is mounted
        fetch(`http://localhost:8080/admin/getAccounts`, {
            method: 'GET'
        })
            .then((response) => {
                if (response.ok) {
                    return response.json(); // Add return statement here
                } else {
                    alert("Error fetching the accounts");
                    throw new Error("Error fetching the accounts");
                }
            })
            .then((data) => {
                setAccounts(data) // Handle the response data here
            })
            .catch((error) => console.error("Error fetching accounts:", error));
    }, []);

    function handleBackClick(e) {
        navigate("/admin/");
    }

    return (
        <div className='AccountsPage'>
            <h2>Accounts List</h2>
            <div className='AccountsList'>
                {accounts.map((account) => {
                    if (account.id !== "admin") {
                        return (
                            <div className='AccountDisplay'>
                                <AccountBanner_admin id={account.id} nickname={account.nickname} />
                            </div>
                        )
                    }
                })}
            </div>
            <button onClick={handleBackClick}>Back to Channels Page</button>
        </div>

    )
}