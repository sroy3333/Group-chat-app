const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    fs.readFile('username.txt', (err, data) => {
        if (err) {
            console.log(err);
            data = 'No Chat Exists';
        }
        res.send(
            `${data}<form action="/" method="POST">
                <input type="text" name="message" id="message">
                <input type="hidden" name="username" id="username">
                <br />
                <button type="submit">Send</button>
            </form>`
        );
    });
});

app.post("/", (req, res) => {
    console.log(req.body.username);
    console.log(req.body.message);
    const trimmedMessage = req.body.message.trim();
    if (trimmedMessage) {
        fs.writeFile("username.txt", `${req.body.username}: ${trimmedMessage}`, { flag: 'a' }, (err) => {
            if (err) console.log(err);
            res.redirect("/");
        });
    } else {
        res.redirect("/");
    }
});

app.get("/login", (req, res) => {
    res.send(
        `<form action="/login" method="POST">
            <input id="username" name="username" type="text" placeholder="username">
            <button type="submit">Login</button>
        </form>`
    );
});

app.post("/login", (req, res) => {
    const username = req.body.username;
    // Clear old chats by emptying the file
    fs.writeFile("username.txt", '', (err) => {
        if (err) console.log(err);
        // Store username in localStorage
        res.send(`<script>localStorage.setItem('username', '${username}'); window.location.href = '/';</script>`);
    });
});

app.listen(4000);