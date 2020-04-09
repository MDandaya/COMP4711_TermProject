let model = require('../models/msg-model');

exports.msgNew = function(req,res,next) {
    res.render('msgSend', { msgCSS: true });
}

exports.msgSend = async function(req,res,next) {
    console.log("msgSend request:");
    console.log(req.body);
    
    let subject = req.body.subject;
    let content = req.body.content;
    let user1 = req.session.userid;
    let user2 = req.params.userid;
    
    // check the existance of the conversation
    var check;
    try {
        check = await model.checkConversation(user1, user2, subject);
        if (check.rowCount == 0) {
            await model.createConversation(user1, user2, subject)
            check = await model.checkConversation(user1, user2, subject);
        }
        await model.createMessage(check.rows[0].id, content);
    } 
    catch (error) {
        console.log(error);
    }

    // send user back to the counter-party's profile page
    res.render('profile', { profileCSS: true });
}

exports.convList = function(req,res,next) {
    console.log(req.session);
    var conversations = model.conversationList(req.session.userID);
    res.render('msgList', { msgCSS: true, conversations: conversations.rows });
}

exports.msgList = function(req,res,next) {
        
}