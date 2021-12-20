const router = require('express').Router();
const { Avatar } = require("../src/models");

router.get("/", async (req, res) => {
    res.render("index");
});

router.get("/upload", (req, res) => {
    res.render("upload");
});

router.get("/random", async (req, res) => {
    var avatars = await Avatar.find({});
    var avatar = avatars[Math.floor(Math.random() * avatars.length)];
    res.render("random", { avatar: avatar.url });
});

module.exports = router;