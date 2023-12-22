const express = require("express");
const axios = require("axios")
const multer = require("multer");
const FormData = require("form-data");
const fs = require("fs");
const app = express();
var cors = require("cors");
const upload = multer({ dest: 'uploads/' });
require('dotenv').config()
app.use(cors());
let imgbbapikey = process.env.IMGBB_API_KEY

let imageURLs = JSON.parse(fs.readFileSync('./imageURLs.json')); // Read from file

// Configuring CORS
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.post("/upload", upload.single('image'), function (req, res) {
    const form = new FormData();
    form.append('image', fs.createReadStream(req.file.path));
  
    axios.post(`https://api.imgbb.com/1/upload?key=${imgbbapikey}`, form, {
        headers: form.getHeaders()
      })
      .then(response => {
        imageURLs.push({url: response.data.data.url}); // Add to array
        fs.unlinkSync(req.file.path); // delete file from upload folder
        fs.writeFileSync('./imageURLs.json', JSON.stringify(imageURLs)); // Write to file
        res.json({ success: true });
      })
      .catch(error => {
        console.error(error);
        res.json({ success: false });
      });
  });
  
  app.delete("/delete/:index", function (req, res) {
    const index = req.params.index;
    if(index >= 0 && index < imageURLs.length){
      imageURLs.splice(index, 1);
      fs.writeFileSync('./imageURLs.json', JSON.stringify(imageURLs)); // Write to file
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  });

app.get("/gallery", function (req, res) {
  res.json(imageURLs);
});

app.listen(3000, function () {
  console.log("Server listening on port 3000!");
});
