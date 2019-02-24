require('dotenv').config();
const express = require("express"),
    router = express.Router();
    
//POST
router.post("/", (req, res) => {
    res.send("working test route");
});

module.exports = router;