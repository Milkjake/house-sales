const mailer = require("nodemailer");
const smtp = require("nodemailer-smtp-transport");

exports.transport = mailer.createTransport(
  smtp({
    host: "in.mailjet.com",
    port: 2525,
    auth: {
      user: process.env.MAILJET_API_KEY,
      pass: process.env.MAILJET_API_SECRET,
    },
  })
);
