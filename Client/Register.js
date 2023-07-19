import React from 'react'
import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const location = useLocation();
    const navigate = useNavigate();
    const [getNickname, setNickname] = useState('');
    return (
        <>
            <div>
                <p>Registering an account with the ID of {location.state.id} and Password of {location.state.password}</p>
                <form>
                    <label for="nickname">Nickname: </label>
                    <input type="text" ID="nickname" onChange={(e) => setNickname(e.target.value)}></input>
                    <input
                        type="submit"
                        value="Register and Sign in"
                        className="registerSignIn"
                        onClick={(e) => {
                            e.preventDefault(); // prevent the default form submission behavior
                            fetch("http://localhost:8080/register", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    id: location.state.id,
                                    password: location.state.password,
                                    nickname: getNickname,
                                }),
                            })
                                .then((response) => {
                                    if (response.ok) {
                                        alert("User successfully created");
                                        navigate("/");
                                    } else if (response.status === 409) {
                                        alert("User with that ID or nickname already exists");
                                        navigate("/");
                                    } else {
                                        alert("Error creating user");
                                    }
                                })
                                .catch((error) => {
                                    console.error("Error creating user:", error);
                                    alert("Error creating user");
                                });
                        }}
                    ></input>
                    <p>Note: This nickname is shown on your public profile</p>
                </form>
            </div>
        </>
    )
}