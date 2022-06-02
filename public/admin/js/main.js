// This is the front end js file

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const selectedLanguage = document.getElementById("selected-language");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

const { username, room, language } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//We now have access to the front end socket here
const socket = io();

//send the room name and user name to the server
socket.emit("joinRoom", { username, room, language });

//Get room and users
socket.on("roomUsers", ({ users, room, language }) => {
  outputLanguage(language);
  outputRoomName(room);
  outputUsers(users);
});

// Catch the message here
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Submit the form (Handwriting)
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //gettting the message
  const msg = e.target.elements.msg.value;
  //Emit message to the server
  socket.emit("chatMessage", msg);
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Submit the form (Voice Recognition)
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //gettting the message
  const output = e.target.elements.output.value;
  //Emit message to the server
  socket.emit("chatMessage", output);
  e.target.elements.output.value = "";
  e.target.elements.output.focus();
});

// Output message to
function outputMessage(message) {
  if (message.type == "system" || message.language == language) {
    const div = document.createElement("div");

    div.classList.add("message");
    console.log(`Ahmet ${message.translatedText}`);
    div.innerHTML =
      ` <body>
            <p class="meta">${message.textMessage}<span>${message.time}</span></p>
            <p id="mesaj" class="text">
                ${message.textMessage}
                <button id="text-audio" class="imaj" type="button" onclick="textToAudio(` +
      "`" +
      message.textMessage +
      "`" +
      ",'" +
      message.language +
      `')"><img src="admin/img/hoparlor.jpeg" ></button>   
            </p>
            </body>`;

    document.querySelector(".chat-messages").appendChild(div);
  }
}

function textToAudio(message, lang) {
  let speech = new SpeechSynthesisUtterance();
  speech.lang = getLang(lang);

  speech.text = message;
  speech.volume = 1;
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}

function getLang(language) {
  let lang = "en-US";
  switch (language) {
    case "en":
      lang = "en-US";
      break;
    case "tr":
      lang = "tr-TR";
      break;
    case "fr":
      lang = "fr-FR";
      break;
    case "es":
      lang = "es-ES";
      break;
    case "it":
      lang = "it-IT";
      break;
    case "de":
      lang = "de-DE";
      break;
  }
  return lang;
}

function outputLanguage(language) {
  selectedLanguage.innerText = language;
}

//Output room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users.map((user) => `<li>${user.username}</li>`).join("")}
    `;
}
