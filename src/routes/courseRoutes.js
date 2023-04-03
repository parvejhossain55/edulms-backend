const router = require('express').Router();

router.get('/course', (req, res)=>{
    res.send('course')
})

module.exports = router;
