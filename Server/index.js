var mysql = require('mysql');
const express = require('express');
const App = express();

// Adding the body-parser middleware to the express App for handling JSON data.
const bodyParser = require("body-parser");
App.use(bodyParser.urlencoded({ extended: true }));
App.use(bodyParser.json());

// Adding cors middleware to the express App
const cors = require('cors');
const { error } = require('console');
App.use(cors());

// creating a connection to the main mysql database
const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the main database...");
    init_database();
});

App.get('/health', (req, res) => {
    res.status(200).send('OK');
});

// App's POST method for handling logging in.
App.post('/signIn', (req, res) => {
    console.log("logging in...")
    const { id, password } = req.body;

    // check if user exists in database
    const query = 'SELECT * FROM Accounts WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else if (results.length === 0) {
            res.status(409).send('Invalid ID or password');
            console.error('Invalid Log in:', err);
        } else {
            const user = results[0];
            if (user.password !== password) {
                res.status(409).send('Invalid ID or password');
                console.error('Invalid Log in: Password:', err);
            } else {
                console.log("login successful");
                // sends 200 status code and user's nickname
                res.status(200).send(user.nickname);
            }
        }
    });

})

// App's POST method for handling registration.
App.post('/register', (req, res) => {
    const { id, password, nickname } = req.body;

    // Check if ID already exists in database
    const selectQuery = 'SELECT * FROM Accounts WHERE id = ?';
    connection.query(selectQuery, [id], (error, results) => {
        if (error) {
            res.sendStatus(500);
            console.log(error.message);
        } else if (results.length > 0) {
            res.sendStatus(409);
            console.log('User with that ID already exists');
        } else {
            // Check if nickname already exists in database
            const selectQuery2 = 'SELECT * FROM Accounts WHERE nickname = ?';
            connection.query(selectQuery2, [nickname], (error, results) => {
                if (error) {
                    res.sendStatus(500);
                    console.log('Error checking for existing user');
                } else if (results.length > 0) {
                    res.sendStatus(409);
                    console.log('User with that nickname already exists');
                } else {
                    // Insert new user into database
                    const insertQuery = 'INSERT INTO Accounts (id, password, nickname) VALUES (?, ?, ?)';
                    connection.query(insertQuery, [id, password, nickname], (error, results) => {
                        if (error) {
                            res.sendStatus(500);
                            console.log('Error inserting new user');
                        } else {
                            res.sendStatus(200);
                            console.log("User successfully created")
                        }
                    });
                }
            });
        }
    });

})


// App's POST method for creating a new channel
App.post('/createChannel', (req, res) => {
    console.log("creating new channel...");
    const { name, des, created_by } = req.body;

    // insert new channel into database
    const query = 'INSERT INTO Channels (name, description, created_by) VALUES (?, ?, ?)';
    connection.query(query, [name, des, created_by], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error inserting new channel into database:', err);
        } else {
            // Send the inserted channel's ID in the response
            res.status(200).json({ id: results.insertId });
            console.log("New channel created successfully");
        }
    });
});

// App's DELETE method for deleting a channel by its channel id with the admin's request
App.delete('/admin/deleteChannel/:id', (req, res) => {
    const channelID_toBeDeleted = req.params.id;
    const query1 = "DELETE FROM Messages where channel_id = ?";
    const query2 = "DELETE FROM Channels where id = ?";
    connection.query(query1, [channelID_toBeDeleted], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            connection.query(query2, [channelID_toBeDeleted], (err, results) => {
                if (err) {
                    res.status(500).send('Internal server error');
                    console.error('Error querying database:', err);
                } else {
                    res.status(200).json("Channel Deleted Successfully");
                }
            })
        }
    });
})

// GET method to retrieve channels info from MySQL database
App.get('/channels', (req, res) => {
    const query = 'SELECT * FROM Channels';
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            res.status(200).json(results);
        }
    });
});

// GET method to retrieve a single channel by its ID
App.get('/channel/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Channels WHERE id = ?';
    connection.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// POST method to send a new message to a specific channel
App.post('/user/:username/channel/:channelID/messages/newMessage', (req, res) => {
    const content = req.body.content;
    const nickname = req.body.nickname;
    const username = req.params.username
    const channelID = req.params.channelID

    const query = 'INSERT INTO Messages (content, channel_id, account_id, nickname) VALUES (?, ?, ?, ?)';
    connection.query(query, [content, channelID, username, nickname], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error inserting new message into database:', err);
        } else {
            // Fetch the newly created message
            const fetchMessageQuery = 'SELECT * FROM Messages WHERE id = ?';
            connection.query(fetchMessageQuery, [results.insertId], (fetchErr, fetchResults) => {
                if (fetchErr) {
                    res.status(500).send('Internal server error');
                    console.error('Error fetching new message from database:', fetchErr);
                } else {
                    res.status(200).json(fetchResults[0]);
                }
            });
        }
    });
});

// POST method to send a new reply to a specific channel
App.post('/user/:username/channel/:channelID/messages/newReply', (req, res) => {
    const content = req.body.content;
    const nickname = req.body.nickname;
    const dest_id = req.body.dest_id;
    const username = req.params.username
    const channelID = req.params.channelID

    const query = 'INSERT INTO Messages (content, channel_id, account_id, nickname, dest_id) VALUES (?, ?, ?, ?, ?)';
    connection.query(query, [content, channelID, username, nickname, dest_id], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error inserting new message into database:', err);
        } else {
            // Fetch the newly created message
            const fetchMessageQuery = 'SELECT * FROM Messages WHERE id = ?';
            connection.query(fetchMessageQuery, [results.insertId], (fetchErr, fetchResults) => {
                if (fetchErr) {
                    console.error('Error fetching new message from database:', fetchErr);
                    res.status(500).send('Internal server error');
                } else {
                    res.status(200).json(fetchResults[0]);
                }
            });
        }
    });
});

// GET method to retrieve messages for a specific channel
App.get('/user/:username/channel/:channelID/messages/', (req, res) => {
    const { accountInfo, channelID } = req.params;

    const query = 'SELECT * FROM Messages WHERE channel_id = ?';
    connection.query(query, [channelID], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            res.status(200).json(results);
        }
    });
});

// DELETE methods to delete a specific message by its id from a specifict channel with admin's request
App.delete('/admin/deleteMessage/:messageID', (req, res) => {
    const messageID = req.params.messageID;
    const query = "DELETE from Messages where id = ?";
    connection.query(query, [messageID], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            res.status(200).json("Message Deleted Successfully");
        }
    });
})

// Delete method to delete a specific account by its id with admin's request
App.delete('/admin/deleteAccount/:accountID', (req, res) => {
    const accountID = req.params.accountID;
    const query = "DELETE from Accounts where id = ?";
    connection.query(query, [accountID], (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            res.status(200).json("Account Deleted Successfully");
        }
    });
})

// Get All the Accounts information with admin access
App.get('/admin/getAccounts', (req, res) => {
    const query = "SELECT * from Accounts";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send('Internal server error');
            console.error('Error querying database:', err);
        } else {
            res.status(200).json(results);
        }
    })
})

// add a like to a messages with a message ID
App.post('/user/:username/channel/:channelID/message/:messageID/like', (req, res) => {
    const messageID = req.params.messageID
    const query = "UPDATE Messages SET likes = likes + 1 WHERE id = ?";
    connection.query(query, [messageID], (err, results) => {
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            const query2 = "select * from Messages where id = ?";
            connection.query(query2, [messageID], (err, results) => {
                if (err) {
                    res.status(500);
                    console.error(err);
                } else { 
                    results
                }
            })
        }
    })
})

// add a dislike to a messages with a message ID
App.post('/user/:username/channel/:channelID/message/:messageID/dislike', (req, res) => {
    const messageID = req.params.messageID
    const query = "UPDATE Messages SET dislikes = dislikes + 1 WHERE id = ?";
    connection.query(query, [messageID], (err, results) => {
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            res.status(200);
        }
    })
})

// get a message's rating by its id
App.get('/user/:username/channel/:channelID/message/:messageID/rating', (req, res) => {
    const messageID = req.params.messageID
    const query = "SELECT * from Messages WHERE id = ?";
    connection.query(query, [messageID], (err, results) => {
        const rating = {
            likes: results[0].likes,
            dislikes: results[0].dislikes
        }
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            res.status(200);
            res.json(rating)
        }
    })
})

// search a specific string in all the messages and return the first 5 messages that have a similar content
App.get('/user/:username/find/sc/:string', (req, res) => {
    const string = req.params.string
    const query = "SELECT * FROM Messages WHERE content LIKE ? LIMIT 5;";
    connection.query(query, [`%${string}%`], (err, results) => {
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            res.status(200);
            res.json(results)
        }
    })
})

// search a specific user in all the messages and return the first 5 users that have a similar nickname
App.get('/user/:username/find/su/:string', (req, res) => {
    const string = req.params.string
    const query = "SELECT * FROM Accounts WHERE nickname LIKE %?% LIMIT 5;";
    connection.query(query, [string], (err, results) => {
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            res.status(200);
            res.json(results)
        }
    })
})

// search and return the first 5 most liked messages
App.get('/user/:username/find/mlc/', (req, res) => {
    const query = "SELECT * FROM Messages ORDER BY likes DESC LIMIT 5;";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            res.status(200);
            res.json(results)
        }
    })
})

// search and return the first 5 most disliked messages
App.get('/user/:username/find/mdc/', (req, res) => {
    const query = "SELECT * FROM Messages ORDER BY dislikes DESC LIMIT 5;";
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500);
            console.error(err);
        } else {
            res.status(200);
            res.json(results)
        }
    })
})

// Making the App server to listen to the 8080 port
var listener = App.listen(8080, function () {
    console.log('Listening on port ' + listener.address().port); //Listening on port 8080
});

// checks if the tables exist, if not, initialize them
function init_database() {

    // Check/initialize Accounts table
    const createAccountsTable = `CREATE TABLE IF NOT EXISTS Accounts (
    id VARCHAR(255) NOT NULL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;
    connection.query(createAccountsTable, (err, results, fields) => {
        if (err) {
            console.error(err);
        }
    });

    // Check/initialize Channels table
    const createChannelsTable = `CREATE TABLE IF NOT EXISTS Channels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(255) NOT NULL,
    FOREIGN KEY (created_by) REFERENCES Accounts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    connection.query(createChannelsTable, (err, results, fields) => {
        if (err) {
            console.error(err);
        }
    });

    // Check/initialize Messages table
    const createMessagesTable = `CREATE TABLE IF NOT EXISTS Messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    channel_id INT NOT NULL,
    account_id VARCHAR(255) NOT NULL,
    nickname VARCHAR(255) NOT NULL,
    dest_id VARCHAR(255) DEFAULT NULL,
    likes INT DEFAULT 0,
    dislikes INT DEFAULT 0,
    FOREIGN KEY (channel_id) REFERENCES Channels(id),
    FOREIGN KEY (account_id) REFERENCES Accounts(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;
    connection.query(createMessagesTable, (err, results, fields) => {
        if (err) {
            console.error(err);
        }
    });

    // Create the admin Account
    const checkadmin = "select * from Accounts where id = 'admin'";
    connection.query(checkadmin, (err, results, fields) => {
        if (results.length === 0) {
            const createAdminAccount = 'INSERT INTO Accounts (id, password, nickname) VALUES ("admin", "admin", "admin")'
            connection.query(createAdminAccount, (err, results, fields) => {
                if (err) {
                    console.error(err)
                    console.log("Error Initializing Admin's Account")
                }
            })
        }
    })

    // logs the appropriate message
    console.log("Database tables confirmed...");
}

