var app       = require("express")(),
    mongoose  = require("mongoose"),
    bodyparser=require("body-parser");

mongoose.connect("mongodb://localhost/camps");
var campgroundSchema = new mongoose.Schema({
		name:String,
		image:String,
		description:String
	});
var Campground=mongoose.model("Campground",campgroundSchema);
var commentSchema =  mongoose.Schema({
		text:String,
		author: String
	});
var Comment=mongoose.model("Comment",commentSchema);


app.use(bodyparser.urlencoded({extended:true}));
app.set("view engine","ejs");

app.get("/",function(req,res){
	res.render("landing");
});
app.get("/campgrounds",function(req,res){
	Campground.find({},function(err,camp){
			if(err)
			      console.log(err);
			else
			      res.render("campground",{campgrounds:camp});
	});
	
});
app.get("/campgrounds/new",function(req,res){
	res.render("new");
});
app.post("/campgrounds",function(req,res){
	var campName   = req.body.camp;
	var image      = req.body.image;
	var description= req.body.description; 
	var newCamp = {name:campName,image:image,description:description};

	Campground.create(newCamp,function(err,Campground){
			if(err)
			     console.log(err);
			else
			     res.redirect("/campgrounds");
	}); 	
});
app.get("/campgrounds/:id",function(req,res){
	Campground.findById(req.params.id,function(err,camp){
			if(err)
			      console.log(err);
			else
			      res.render("show",{campgrounds:camp});
});
});
app.get("/campgrounds/:id/comments/new",function(req,res){
	Campground.findById(req.params.id,function(err,camp){
			if(err)
			      console.log(err);
			else
			      res.render("comment",{campgrounds:camp});
});
});
app.post("/campgrounds/:id/comments",function(req,res){
	//var comment   = req.body.comment;
	Campground.findById(req.params.id,function(err,campgrounds){
		       if(err){
			      console.log(err);
			      res.redirect("/campgrounds");}
			else{
		             Comment.create(req.body.comment,function(err,comment){
				if(err)
				    console.log(err);
				else{
				
			      var x=[];
				campgrounds.comments=x;
			     campgrounds.comments.push(comment);
			     campgrounds.save();
			     res.redirect("/campgrounds/" + campgrounds._id);
					}
			    });
			  }
		});

	});	


app.listen(3000,function(){
	console.log("Server is running");
});
