const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const Chat = require("./models/chat.js")

const methodOverride = require('method-override')

const ExpressError = require("./ExpressError.js");
 
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

app.get("/chats", async(req, res, next)=>{
    try{
        let chats = await Chat.find();
    res.render("index.ejs", {chats});
    }catch(err){
        next(err);
    }
    
});

app.get("/chats/new", (req, res)=>{
    // this is only work with not async function agar ye error async routes me daala to error
    //throw new ExpressError(404, "page not found"); // comment this line then new.ejs work
    res.render("new.ejs");
})

app.post("/chats", async (req, res, next)=>{
    // validation error using try and catch block
    try{
        let {from, to, message} = req.body;
    let newChat = new Chat({
        from: from,
        to: to,
        message: message,
        created_at: new Date()
    });
    await newChat.save()
    // console.log(newChat);
    res.redirect("/chats");
    }catch(err){
        next(err);
    }
    
})

// New Show route for async error handling

app.get("/chats/:id", async(req, res, next) =>{
    try{
        let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat){   
       // throw new ExpressError(404, "chat not found");
       next(new ExpressError(404, "chat not found"));
   }
   console.log(chat);
   res.render("show.ejs", {chat});
    }catch(err){
        next(err);
    }
    // comment-> if id not same then server will be crash. example 67970ffb4961137ef936850c this is correct if i modify last 2 digit (67970ffb4961137ef93685b6) then it will be crash = process.processTicksAndRejections
    // different id according to your system 

    // comment-> async function me express by default next ko call nahi lagata to error handling proper nahi hogi 
})


//edit route
app.get("/chats/:id/edit", async (req, res, next) =>{
    try{
        let {id} = req.params;
    let chat = await Chat.findById(id);
    // console.log(chat);
    // res.send("edit page");
    res.render("edit.ejs", {chat});
    }catch(err){
        next(err);
    }
    

})

app.put("/chats/:id", async (req, res, next) =>{
    try{
        let {id} = req.params;
    let{message: newMsg} = req.body;
    let updateMessage = await Chat.findByIdAndUpdate(
        id,
        {message: newMsg},
        {runValidators: true, new: true});
    console.log(updateMessage);
    res.redirect("/chats");
    }catch(err){
        next(err);
    }
})

app.delete("/chats/:id", async(req, res, next)=>{
    try{
        let {id} = req.params;
        let deletedMessage = await Chat.findByIdAndDelete(id);
        console.log(deletedMessage);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }
})

// error handling middleware
app.use((err, req, res, next) =>{
    let {status = 500, message = "Some error Occured"} = err;
    res.status(status).send(message);
})

app.listen(8080, (req, res) =>{
    console.log("running");
})