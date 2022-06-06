const moment = require("moment");

function formatMessage(username, user, language, textMessage, type = null) {
  return {
    username: username,
    user: user,
    language: language,
    textMessage: textMessage,
    type: type,
    time: moment().format("h:mm a"),
  };
}

module.exports = formatMessage;
