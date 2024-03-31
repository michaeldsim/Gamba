const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
require('dotenv').config();

router.get("/verifySession", (req, res) => {
    let token = req.headers.cookie; // Tokens are typically sent in the "Authorization" header
    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    if(token.startsWith("jwt=")) {
        token = token.slice(4, token.length);
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ "error": err.message });
        }

        const user = {
            id: decoded.id,
            username: decoded.username
        };

        return res.status(200).json(user);
    })
});

module.exports = router;