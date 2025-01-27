const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Chat = require("./models/chat.js")

const methodOverride = require('method-override')
 
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'))

main()
.then(() =>{
    console.log("connection successful");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/errorHandiling');
}
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));


app.get("/", (req, res)=>{
    res.send("server is running");
});

app.get("/chats", async(req, res)=>{
    let chats = await Chat.find();
    res.render("index.ejs", {chats});
});

app.get("/chats/new", (req, res)=>{
    res.render("new.ejs");
})

app.post("/chats", async (req,res)=>{
    let {from, to, message} = req.body;
    let newChat = await new Chat({
        from: from,
        to: to,
        message: message,
        created_at: Date.now()
    });
    newChat.save()
    .then((res) =>{
        console.log("chat was saved");
    }).catch((err)=>{
        console.log(err);
    })
    console.log(newChat);
    res.redirect("/chats");
})


//edit route
app.get("/chats/:id/edit", async (req, res) =>{
    let {id} = req.params;
    let chat = await Chat.findById(id);
    // console.log(chat);
    // res.send("edit page");
    res.render("edit.ejs", {chat});

})

app.put("/chats/:id", async (req, res) =>{
    let {id} = req.params;
    let{message: newMsg} = req.body;
    let updateMessage = await Chat.findByIdAndUpdate(
        id,
        {message: newMsg},
        {runValidators: true, new: true});
    console.log(updateMessage);
    res.redirect("/chats");

})

app.delete("/chats/:id", async(req, res)=>{
    let {id} = req.params;
    let deletedMessage = await Chat.findByIdAndDelete(id);
    console.log(deletedMessage);
    res.redirect("/chats");

})

app.listen(8080, (req, res) =>{
    console.log("running");
})