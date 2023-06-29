const mongoose =require("mongoose");
const axios =require("axios");
const express=require('express');

mongoose.connect("mongodb://127.0.0.1:27017/footballPage")
.then(()=>console.log("connection Successfull"))
.catch((err)=>console.log(err));

const newsSchema=new mongoose.Schema({
    id: String,
    name: String,
    author: String,
    title: String,
    description: String,
    url: String,
    urlToImage: String,
    publishedAt: String,
    content: String
});

const app=express();
const News=mongoose.model("News",newsSchema);

// const createNews=new News({
//     author:"deepanshu",
//     title:"life",
//     description: "Great things take time and late ones are always legendary"
// });

// createNews.save();

const url ="https://newsapi.org/v2/everything?language=en&q=football&from=2023-06-11&to=2023-06-13&sortBy=popularity&apiKey=555c57796fed443ebf5842596059aeb1";

axios.get(url)
.then((response) => {
    const newsData = response.data.articles;

    newsData.forEach((article) => {
    const news = new News({
        id: article.id,
        name: article.name,
        author: article.author,
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: article.publishedAt,
        content: article.content

    });

    news.save()
        .then(() => {
            console.log('News saved:', article.id);
        })
        .catch((error) => {
            console.error('Error saving news:', error);
        });
    });
})
.catch((error) => {
    console.error('Error fetching news data:', error);
});

app.get("/",async(req,res)=>{
    const data=await News.find().sort({publishedAt: -1});
    res.send(data);
})

app.listen(3000,()=>{
    console.log("Server Started at port 3000");
})

