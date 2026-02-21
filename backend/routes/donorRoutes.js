const express = require("express");
const router = express.Router();
const { getDonors, createDonor } = require("../controllers/donorController");

router.route("/").get(getDonors).post(createDonor);

module.exports = router;
