const router = require('express').Router();
const { Avatar } = require("../src/models");
const axios = require("axios");
const { shuffle } = require("../src/utils");

router.get("/", (req, res) => {
    res.send("<3");
});

router.post("/upload", (req, res) => {
    var { steam } = req.body;

    if (!steam) {
        res.status(400).send("Missing steam id");
        return;
    }

    if (!steam.match(/^7656119[0-9]{10}$/)) {
        res.status(400).send("Invalid steam id");
        return;
    }

    axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${process.env.steamkey}&steamids=${steam}`).then(async response => {
        if (response.data.response.players.length == 0) {
            res.status(400).send("Steam account not found");
            return;
        }

        const avatarCheck = await Avatar.findOne({ url: response.data.response.players[0].avatarfull }); 
        if (avatarCheck) {
            res.status(409).send("Avatar already exists");
            return;
        }

        var { steamid, avatarfull } = response.data.response.players[0];

        var avatar = new Avatar({
            url: avatarfull,
            user: parseInt(steamid),
            uploader: req.ip === "::1" ? "localhost" : req.ip
        });

        await avatar.save();

        res.send(avatar);
    }).catch(error => {
        res.status(400).send(error);
        return;
    });
});

router.get("/avatars", async (req, res) => {
    var { page, sort } = req.query;

    if (!page) {
        page = 1;
    }

    if (!sort) {
        sort = "date";
    }

    var avatars = await Avatar.find({}).sort({ [sort]: -1 }).skip(page * 55).limit(55);
    avatars = avatars.map(avatar => {
        return avatar.url;
    });
    if(!sort) avatars = shuffle(avatars);
    res.send(avatars);
});

module.exports = router;