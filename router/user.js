const express = require('express');
const router = express.Router()
const { getUserById, updateUserAddress, removeAddress, uploadImage, updateProfile } = require('../controller/user');
const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        console.log(file,"lalal");
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage })

router.get('/:id', getUserById)
    .patch('/', updateUserAddress)
    .patch('/removeAddress', removeAddress)
    .post("/image", upload.single("avatar"), uploadImage)
    .post("/ProfileUpdate", updateProfile)


module.exports = router


