exports.createMailOptions = function (subject, text) {
  return {
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: subject,
    text: text,
  };
};
