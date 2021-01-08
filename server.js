const express = require("express");
const bodyParser = require("body-parser");

const low = require("lowdb");
const FileSync = require("lowdb/adapters/FileSync");
const adapter = new FileSync("db/db.json");
const db = low(adapter);
db.read();

const nanoid = require("nanoid").nanoid;
const sanitize = require("sanitizer").sanitize;

const app = express();
app.use([
    require("cors")(), 
    bodyParser.json()
]);

app.listen(8080, () => {
    console.log("Server online");
});

app.post("/api/postcomment", (req, res) => {
    if(!req.body.name || !req.body.content || !req.body.page) return res.status(400).json({success: false, message: "incomplete data"});
    if(!db.has(`comments.${sanitize(req.body.page)}`)) return res.status(400).json({
        success: false,
        message: "invalid comments page to post to"
    });
    let id = nanoid();
    db.get(`comments.${sanitize(req.body.page)}`)
    .push({
        id: id,
        name: sanitize(req.body.name),
        content: sanitize(req.body.content),
        created: Date.now(),
        parent: sanitize(req.body.parent) || "none"
    }).write();
    return res.status(200).json({
        success: true,
        message: "comment posted successfully"
    });
});

app.post("/api/getcomments", (req, res) => {
    if(!db.has(`comments.${sanitize(req.body.page)}`)) return res.status(400).json({
        success: false,
        message: "invalid comments page to post to"
    });
    return res.status(200).json({
        success: true,
        content: db.get(`comments.${sanitize(req.body.page)}`)
    });
});