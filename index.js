const express = require("express");
const subdomain = require("express-subdomain");
const app = express();
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");

const userRouter = require("./router/user");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(subdomain("api", userRouter));

let secret = speakeasy.generateSecret({
  name: "2FA-google-authenticator-demo-app",
  issuer: "kadscloud",
});

app.get("/", (req, res) => {
  console.log(secret);
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

app.listen(process.env.PORT || 8080, () =>
  console.log("PORT 8080 is running!")
);
