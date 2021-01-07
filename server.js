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
    if(!req.body.name || !req.body.content) return res.status(400).json({success: false, message: "incomplete data"});
    db.get("comments")
    .push({id: nanoid(), name: sanitize(req.body.name), content: sanitize(req.body.content)})
    .write();
    return res.status(200).json({
        success: true,
        message: "comment posted successfully"
    });
});

app.get("/api/getcomments", (req, res) => {
    return res.status(200).json({
        success: true,
        comments: db.get("comments").__wrapped__
    });
});