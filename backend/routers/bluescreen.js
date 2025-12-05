const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.render("bluescreen.ejs");
});


module.exports = router;
