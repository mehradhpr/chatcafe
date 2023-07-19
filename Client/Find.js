import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Find.css';

export default function Find() {
    var { accountInfo } = useParams();
    var address = `/user/${accountInfo}/`
    if (accountInfo === undefined) address = "/admin/";
    const [searchType, setSearchType] = useState('Find Content');
    const [searchString, setSearchString] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    useEffect(() => {
        if (searchString) {
            if (searchType === "Find Content")
                fetchSearchResults();
        }

    }, [searchString]);

    useEffect(() => {
        if (searchType === 'Find the Most Liked Content') fetch_most_liked();
        if (searchType === 'Find the Most disLiked Content') fetch_most_disliked();
    }, [searchType]);




    const fetchSearchResults = async () => {
        const response = await fetch(`http://localhost:8080/user/admin/find/sc/${searchString}`);
        const data = await response.json();
        setSearchResults(data);
    };



    const fetch_most_liked = async () => {
        const response = await fetch(`http://localhost:8080/user/:username/find/mlc/`);
        const data = await response.json();
        setSearchResults(data);
    };

    const fetch_most_disliked = async () => {
        const response = await fetch(`http://localhost:8080/user/:username/find/mdc/`);
        const data = await response.json();
        setSearchResults(data);
    };

    const handleSearchTypeChange = (event) => {
        setSearchType(event.target.value);
    };

    const handleSearchStringChange = (event) => {
        setSearchString(event.target.value);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSearchString(event.target.searchString.value);
    };

    return (
        <div className="find-container">
            <h2>Find</h2>

            <form onSubmit={handleSearchSubmit} className='thisForm'>
                <label>
                    <select value={searchType} onChange={handleSearchTypeChange}>
                        <option value="Find Content">Find Content</option>
                        <option value="Find the Most Liked Content">Find the Most Liked Content</option>
                        <option value="Find the Most disLiked Content">Find the Most disLiked Content</option>
                    </select>
                </label>

                <label>
                    Search String:
                    <input type="text" name="searchString" onChange={handleSearchStringChange} />
                </label>
            </form>
            
            <Link to={address} className='AccountsB'>Go Back to Channels List</Link>

            <div className="results">
                <h3>Results:</h3>
                {searchResults.map((result, index) => (
                    <div key={index} className="result-item">
                        <p>{result.content} | likes:{result.likes} | dislikes:{result.dislikes}</p>
                    </div>
                ))}
            </div>
        </div>
    );

}