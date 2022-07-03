// This is the front end js file

const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
//const selectedLanguage = document.getElementById("selected-language");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
const handButton = document.getElementById("btnHand");

const { username, room, language } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

//We now have access to the front end socket here
const socket = io();

//send the room name and user name to the server
socket.emit("joinRoom", { username, room, language });

//Get room and users
socket.on("roomUsers", ({ users, room, language }) => {
  //outputLanguage(language);
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
  const msg = e.target.elements?.msg?.value;
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

handButton.addEventListener("click", (e) => {
  const handBtn = document.getElementById("btnHand");
  let hand = true;

  if (!handBtn.classList.contains("btn-hand-yellow")) {
    handBtn.classList.add("btn-hand-yellow");
    handBtn.classList.remove("btn-hand-black");

    hand = true;
  } else {
    handBtn.classList.add("btn-hand-black");
    handBtn.classList.remove("btn-hand-yellow");

    hand = false;
  }
  //Emit message to the server
  socket.emit("hand", username, room, hand);
});

// Output message to
function outputMessage(message) {
  if (message.type == "system" || message.language == language) {
    const div = document.createElement("div");
  

    div.classList.add("message");
    console.log(`${message.translatedText}`);
    div.innerHTML =
      ` <body>
      <p class="meta">${message.username}<span>  ${message.time}</span></p>
            <p id="mesaj" class="text">
                ${message.textMessage}
                <button style="border:none; background-color:transparent" id="text-audio" class="main" type="button" onclick="textToAudio(` +
      "`" +
      message.textMessage +
      "`" +
      ",'" +
      message.language +
      `')"><i style="font-size:18px;" class="fas fa-volume-up"></i></button>   
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
    case "ru":
      lang = "ru-RU";
      break;
    case "hi":
      lang = "hi-HI";
      break;
    case "zh":
      lang = "zh-CN";
      break;
    case "pl":
      lang = "pl-PL";
      break;
    case "pt":
      lang = "pt-PT";
      break;
    case "nl":
      lang = "nl-NL";
      break;
    case "ja":
      lang = "ja-Ja";
      break;
  }
  return lang;
}

//Output room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

function outputUsers(users) {
  userList.innerHTML = `
    ${users
      .map(
        (user) =>
          `<li>${user.username} 
          <i id='${user.username}' style="color: #ee7067" class="fa fa-hand-paper hidden">
          </i> 
          <span id='${user.username}-badge' class="hidden badge">${user.badge}</span>
          </li>`
      )
      .join("")}
    `;

  users.map((user) => {
    const handIcon = document.getElementById(user.username);
    const badge = document.getElementById(user.username + "-badge");
    if (user.hand) {
      handIcon.classList.remove("hidden");
      badge.classList.remove("hidden");
    } else {
      handIcon.classList.add("hidden");
      badge.classList.add("hidden");
    }
  });
}
