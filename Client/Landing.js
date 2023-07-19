import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Landing() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    function handle_signIn_click(e) {
        e.preventDefault();
        fetch('http://localhost:8080/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: username,
                password: password
            })
        })
            .then((response) => {
                if (response.ok) {
                    alert("Log in Successful");
                } else if (response.status === 409) {
                    alert("Invalid Username or Password");
                    window.location.reload();
                } else {
                    alert("Error logging in...");
                    window.location.reload();
                }
                return response;
            })
            .then(response => response.text())
            .then(nickN => {
                // check if it is the admin
                if (username === "admin" && password === "admin") {
                    navigate("/admin");
                }
                // if it is a user and not the admin
                else {
                    var accountInfo = JSON.stringify({
                        username: username,
                        password: password,
                        nickname: nickN
                    })
                    navigate(`/user/${encodeURIComponent(accountInfo)}`);
                }
            })
    }

    return (
        <>
            <div>
                <h2>Welcome to Chat Cafe</h2>
                <form>
                    <label for="ID">ID: </label>
                    <input type="text" id="ID" name="IDInput" value={username} onChange={e => setUsername(e.target.value)} /><br />
                    <label for="password">Password: </label>
                    <input type="password" id="password" name="passwordInput" value={password} onChange={e => setPassword(e.target.value)} /><br />
                    <input type="submit" value="Sign in" className='signInB'
                        onClick={handle_signIn_click} />
                    <input type="submit" value="Register" className='RegisterB'
                        onClick={() => {
                            navigate("/register", { state: { id: username, password: password } })
                        }} />
                </form>
                <p>Chat Cafe is a secure online chat platform where you can create channels and start texing</p>
            </div>
        </>
    )
}


export default Landing;