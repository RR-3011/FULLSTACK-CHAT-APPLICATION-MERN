const { addMsg, getAllMessage} = require("../controllers/messagesController");
const router = require("express").Router();

router.post("/addmsg/", addMsg);
router.post("/getmsg", getAllMessage);

module.exports = router;