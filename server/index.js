// server/index.js
const path = require('path');
const express = require('express');
const axios = require('axios');
const PORT = process.env.PORT || 3001;
var mysql = require('mysql');
var con = mysql.createConnection({ // wrong connection details for now...
  host: "",
  user: "",
  password: "",
  database: "",
  port: ""
});

const app = express();

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

app.get("/db", (req, res) => {
  console.log(con.state);
  if(con.state === "authenticated"){
    res.json({message: "connected :)"});
  } else {
    con.connect(function(err) {
      if (err) throw err;
      res.json({message: "connected"})
    });
  }
})

// app.post("/reg", (req, res) => {
//   console.log(req);
//   if(con.state === "authenticated"){
//     res.json({message: "registered :)"});
//   } else {
//     con.connect(function(err) {
//       if (err) throw err;
//       res.json({message: "connected"})
//     });
//   }
// })


// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));
const searches = ["rick+astley", "meme", "happy", "sweet", "southpark"];
// Handle GET requests to /api route
app.get("/api", async (req, res) => {
    let rnd = Math.random();
    let searchrez = "";
    if(rnd < 0.25){
      searchrez = searches[0];
    } else {
      searchrez = searches[Math.floor(Math.random()*4)+1];
    }
    console.log(`rnd: ${rnd}`);
    let url = `https://g.tenor.com/v1/random?q=${searchrez}&key=9PQQ1TKKO9Y5&limit=8`;
    let response = await axios.get(url);
    let gif = response.data.results[0];
    res.json({ message: gif.media[0].mediumgif.url });
});


// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});