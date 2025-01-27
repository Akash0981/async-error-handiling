const mongoose = require('mongoose');
const Chat = require("./models/chat.js");
main()
    .then(() => {
        console.log("connection success");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/errorHandiling');
}

let allChats = [
    {
        from: "neha",
        to: "priya",
        message: "send me your roll no",
        created_at: new Date()
    },
    {
        from: "ak",
        to: "priya",
        message: "now i graduate",
        created_at: new Date()
    },
    {
        from: "mohit",
        to: "ak",
        message: "congrats",
        created_at: new Date()
    },
    {
        from: "rishabh",
        to: "ak",
        message: "i have a job for you in mnc",
        created_at: new Date()
    }
];



Chat.insertMany(allChats);
