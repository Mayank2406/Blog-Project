var express        = require('express');
var methodOverride = require('method-override');
var bodyparser     = require('body-parser');
var expressSanitizer = require("express-sanitizer");
var app            = express();
var mongoose       = require("mongoose");

mongoose.connect("mongodb://localhost/blogwebsite",{useUnifiedTopology: true,useNewUrlParser: true});
app.set('view engine','ejs');

app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));
app.use(methodOverride('_method'));
app.use(expressSanitizer());

var BlogSchema =  new mongoose.Schema({
    title : String,
    image : String,
    body : String, 
    created:{type:Date,default:Date.now}
});

var Blog = mongoose.model("Blog",BlogSchema);

// Blog.create({
//     title: "First Blog",
//     image:"https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60",
//     body: "Blogging is an art"
// });

app.get("/",function(req,res)
    {
        res.redirect("/blogs");
    });

//Index Route:
app.get("/blogs",function(req,res){
    Blog.find({},function(err,blogs){    
        if(err)
            console.log(err);
        else    
            res.render("index",{blogs:blogs});
    });
});

// New route:

app.get("/blogs/new",function(req,res){
    res.render("new");
});

// Create Route:

app.post("/blogs",function(req,res){
    req.body.blogs.body = req.sanitize(req.body.blogs.body);
    Blog.create(req.body.blogs,function(err,newBlog){
        if(err)
            res.render("new");
        else
            res.redirect("/blogs");
    });
});

// Show Route:

app.get("/blogs/:id",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            res.redirect("/blogs");
        else    
            res.render("show",{blog:foundBlog});
    });
});

// Edit Route:

app.get("/blogs/:id/edit",function(req,res){
    Blog.findById(req.params.id,function(err,foundBlog){
        if(err)
            res.redirect("/blogs");
        else    
            res.render("edit",{blog:foundBlog});
    });
});

// Update Route:

app.put("/blogs/:id",function(req,res){
    Blog.findByIdAndUpdate(req.params.id,req.body.blogs,function(err,updatedBlog){
        if(err)
            res.redirect("/blogs");
        else
            res.redirect("/blogs/"+ req.params.id);
    });
});

// Delete Route:

app.delete("/blogs/:id",function(req,res){
    Blog.findByIdAndRemove(req.params.id,function(err){
        if(err) 
            res.redirect("/blogs");
        else
            res.redirect("/blogs");
    });
});
        

app.listen(5000,function(req,res){
    console.log("server started...");
});