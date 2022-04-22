const dotenv = require('dotenv').config();
const express = require ('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const http=require('http'); 
const socketio=require('socket.io');
const formatMessage=require('./public/admin/js/messages');
const { format } = require('path');
const  {userJoin,getCurrentUser, getCurrentUserLanguage, getRoomUsers,userLeave}=require('./public/admin/js/users');
const server=http.createServer(app);
const io=socketio(server);
const PORT = 3000 || process.env.PORT;
const {TranslationServiceClient} = require('@google-cloud/translate');
const {Translate} = require('@google-cloud/translate').v2;


const admin = 'T&I';

io.on('connection', (socket)=>{
    

    socket.on('joinRoom',({username,room, language})=>{

        //to join a room
        const user=userJoin(socket.id,username,room, language);
        console.info(`Client's language is [language=${language}]`)
        
        socket.join(user.room);
        
        socket.emit('message' , formatMessage(admin,`Welcome to the chat :). Your selected language is "${user.language}".`));
        
        socket.broadcast.to(user.room).emit('message', formatMessage(admin,`${user.username} has joined the chat!`));

        // Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room),
        });
        
    });
    
    // Listen for the chat message 
    socket.on('chatMessage', (msg)=>{
    const user=getCurrentUser(socket.id);
   
    /*const translate = new Translate();
    const textSecond = (msg);

    async function detectLanguage() {
        let [detections] = await translate.detect(msg);
        detections = Array.isArray(detections) ? detections : [detections];
        console.log('Detections:');
        detections.forEach(detection => {
            console.log(`${detection.input} => ${detection.language}`);
        });
    };
    detectLanguage();

    const translationClient = new TranslationServiceClient();

    const projectId = 'bitirme-projesi-348016';
    const location = 'global';
    const text = (message);

    async function translateText() {
        const request = {
            parent: `projects/${projectId}/locations/${location}`,
            contents: [text],
            mimeType: 'text/html',
            sourceLanguageCode: msg.detectLanguage,
            targetLanguageCode: `${user.language}`,
        };
    const [response] = await translationClient.translateText(request);

    for (const translation of response.translations) {

        if(msg.detectLanguage == `${user.language}`){
            io.to(user.room).emit('message',formatMessage(user.username, msg));
        }
        else {  
            io.to(user.room).emit('message',formatMessage(user.username,`${translation.translatedText}`));
        } 
        
        console.log(`Translation: ${translation.translatedText}`);
    }
}
    translateText();*/       
    io.to(user.room).emit('message',formatMessage(user.username, msg));
    });

     // User disconnects
    socket.on('disconnect',()=>{

        const user=userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message', formatMessage(admin,`${user.username} has left the chat`));


            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            });
        }     
    });

});

const ejs = require('ejs');
const expressLayout = require('express-ejs-layouts');
const path = require('path');
app.use(expressLayout);
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

//Database bağlantısı
require('./src/config/database')
const MongoDBStore = require('connect-mongodb-session')(session);

const sessionStore = new MongoDBStore({
  uri: process.env.MONGODB_CONNECTION_STRING,
    collection: 'Sessions'
});

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave : false,
    saveUninitialized: true,
    cookie : {
        maxAge : 1000 * 60 * 60 * 24
    },
    store : sessionStore
}));

app.use(flash());

app.use((req, res, next) =>{
    res.locals.validation_error = req.flash('validation_error');
    res.locals.success_message = req.flash('success_message')
    res.locals.email = req.flash('email');
    res.locals.name = req.flash('name');
    res.locals.lastname = req.flash('lastname');
    res.locals.password = req.flash('password');
    res.locals.rpassword = req.flash('rpassword');
    res.locals.login_error = req.flash('error');
    next();
})

app.use(passport.initialize());
app.use(passport.session());

const authRouter = require('./src/routers/auth_router');
const userRouter = require('./src/routers/user_router');
const girisRouter = require('./src/routers/giris_router');
const joinRouter = require('./src/routers/join_router');
const chatRouter = require('./src/routers/chat_router');

app.use(express.urlencoded({extended: true}))

const res = require('express/lib/response');
const { $where } = require('./src/model/user_model');

app.get('/', (req, res) =>{
    res.json({mesaj : 'Merhaba'});
})

app.use('/', authRouter);
app.use('/giris' , girisRouter);
app.use('/join', joinRouter);
app.use('/chat', chatRouter);

app.use('/user', userRouter);

server.listen(PORT, () =>{
    console.log(`Server running on ${PORT}..`);
});