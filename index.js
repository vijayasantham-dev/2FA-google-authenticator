const express = require("express");
const app = express();
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let secret = speakeasy.generateSecret({
  name: "2FA-google-authenticator-demo-app",
});

app.get("/", (req, res) => {
  qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    res.render("home", { url: data, success: null });
  });
});

app.post("/", (req, res) => {
  console.log(secret);
  let verified = speakeasy.totp.verify({
    secret: secret.ascii,
    encoding: "ascii",
    token: req.body.token,
  });
  console.log(verified);
  qrcode.toDataURL(secret.otpauth_url, (err, data) => {
    res.render("home", { url: data, success: verified });
  });
});

app.listen(8080, () => console.log("PORT 8080 is running!"));
