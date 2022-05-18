const users=[];

//Join user to chat 
function userJoin(id,username,room, language){
    const user={id,username,room, language};
    users.push(user);
    return user;
}

//Get the current user
function getCurrentUser(id){
    return users.find((user)=>user.id===id);
}

function getCurrentUserAndLanguage(language){
    return users.find((user)=>user.id===language);
}

//User leaves chat 
function userLeave(id){
    const index=users.findIndex(user=>user.id===id);

    if(index!==-1){
        return users.splice(index,1)[0];
    }
}

// Get room users
function getRoomUsers(room){
    return users.filter( user => user.room === room);
}

//
function getLanguage(language){
    return users.filter( user => user.language === language);
}


module.exports={
    userJoin,
    getCurrentUser,
    userLeave,
    getRoomUsers,
    getLanguage,
    getCurrentUserAndLanguage


};