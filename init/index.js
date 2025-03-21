const mongoose = require('mongoose');
const initData = require('./data');
const Post = require('../models/post');



const MONGO_URI = "mongodb://127.0.0.1:27017/campuspost";

main().then(()=>{
    console.log("Connected to DB");
}).catch(err =>{
    console.log("Error occurred", err);
});

async function main() {
    await mongoose.connect(MONGO_URI);
}

const initDB = async ()=>{
   await Post.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj, owner: '67da54e5b8509fdedd142fd2'}))
   await Post.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();

//67da54e5b8509fdedd142fd2