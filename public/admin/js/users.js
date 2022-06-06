let users = [];
//Join user to chat
function userJoin(id, username, room, language, hand = false, badge = 0) {
  const user = { id, username, room, language, hand, badge };
  users.push(user);
  return user;
}

//Get the current user
function getCurrentUser(id) {
  return users.find((user) => user.id === id);
}

//User leaves chat
function userLeave(id) {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    changeBadgeCount(users[index].badge);
    return users.splice(index, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return users.filter((user) => user.room === room);
}

//Get User's Language
function getLanguage(language) {
  return users.find((user) => user.language === language);
}

function userHandChange(room, username, hand) {
  users = users.map((user) => {
    if (user.room === room && user.username === username) {
      const handUserCount = users.filter((user) => user.hand === true);

      if (hand) {
        user.badge = handUserCount.length + 1;
      } else {
        changeBadgeCount(user.badge);
        user.badge = 0;
      }

      user.hand = hand;

      return user;
    }

    return user;
  });

  return users;
}

function changeBadgeCount(userBadgeCount) {
  users = users.map((user) => {
    if (user.hand && userBadgeCount !== 0 && user.badge > userBadgeCount) {
      user.badge = user.badge - 1;
    }
    return user;
  });
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
  getLanguage,
  userHandChange,
};
