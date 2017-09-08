var express = require('express');
var bodyParser = require('body-parser');
var axios = require('axios');

var app = express();
var port = process.env.PORT || 3000;

var access_token = "";
var refresh_token = "";

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    var client_id = process.env.CLIENT_ID;
    var state = "success";
    var url = "https://api.lyft.com/oauth/authorize?client_id=" + client_id + "&scope=public%20profile%20rides.read%20rides.request%20offline&state=" + state + "&response_type=code";
    res.redirect(url);
});

app.get('/oauthcallback', function(req, res) {
  console.log('authorization_code: ', req.query.code);
  var authorization_code = req.query.code;
  axios({
    method: 'post',
    url: 'https://api.lyft.com/oauth/token',
    data: {
      grant_type: "authorization_code",
      code: authorization_code
    },
    auth: {
      username: process.env.CLIENT_ID,
      password: process.env.CLIENT_SECRET
    }
  })
  .then((r) => {
    access_token = r.data.access_token;
    refresh_token = r.data.refresh_token;
    res.redirect('/mytokens');
  })
  .catch((err) => {
  console.log("There was an error with the request : ", err);
})
});

app.get('/mytokens', function(req, res) {
  console.log("access_token: ", access_token);
  console.log("refresh_toekn: ", refresh_token);
});

app.listen(port, function() {
    console.log('Succesfully connected to port', port);
});
