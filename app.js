//jshint esversion:6
//Whenever we want to manipulate strings,objects,array go for LODASH.

const ejs = require("ejs");
const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));






mongoose.connect("mongodb+srv://Akash123:Akash123@cluster0.ikzcw.mongodb.net/todolistDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false 
});

const itemSchema = new mongoose.Schema({   
  name: String
});

const Item = mongoose.model("Item", itemSchema); // mongoose model is usually capitalized



const listSchema = new mongoose.Schema({
  name:String,
  items:[itemSchema]    // items is going to be an array , storing list name, where each array member is having a structure of itemSchema.
});

const List = mongoose.model("List",listSchema); // creating new model.



const item1 = new Item({
  name: "Welcome to the todoList"
});

const item2 = new Item({
  name: "+  is for adding new Item"
});

const item3 = new Item({
  name: "<===   check this to delete"
});




   



/*        insertMany()       */

// Item.insertMany([item1,item2,item3],function(err){
//   if(err)
//     console.log(err);
//   else
//     console.log("Records are successfully saved to the database!");
// });

/*       deleteOne()       */

// Item.deleteOne({
//   _id:"60a0cdf6dbbaf094f8c1fa0e"},function(err){
//   if(err)
//     console.log(err);
//   else
//   console.log("Deleted successfully");
//   });

/*       deleteMany()       */

// Item.deleteMany({
//   _id:"60a13df0d78ce748e8be13f4"
// },function(err){
//   if(err)
//     console.log(err);
//   else
//   console.log("Deleted successfully");
//   });

app.get("/", function (req, res) {


  Item.find({}, function (err, items) {   // we are reading the docs from our mongoDB database 
  //model.find()

    if (err) console.log(err);
    else {

      if (items.length === 0) {
        Item.insertMany([item1, item2, item3], function (err) {
          if (err) console.log(err);
          else console.log("Records are successfully saved to the database!");
        });
        res.redirect("/");
      }
      else{
        res.render("list", { listTitle: "Today", newListItems: items });
      }

    }
  });

 
});


app.get("/:customListNames",function(req,res){

  const customListNames = _.capitalize(req.params.customListNames);


  List.findOne({name:customListNames},function(err,found){    // we got one object with two fields

    if(err) console.log(err);
    else  {
      if(!found) {    // if document not found
        //Create a new list
        const list = new List({     // creating a new list document
          name:customListNames,
          items:[item1,item2,item3]
        });
      
        list.save(function(err){;        
        res.redirect("/"+customListNames);
      });
      }
      else {
          //List exists simple render it
          res.render("list",{ listTitle: found.name, newListItems: found.items  });
      };
    };
  });

});



app.post("/", function (req, res) {
  const itemName = req.body.newItem;  //football
  const listHeading = req.body.list;  //play

  const newItemName = new Item({
    name:itemName
  })

  if(listHeading === "Today")
  {
    newItemName.save(function(err){;
    res.redirect("/");});
  }
  else{

    List.findOne({name:listHeading},function(err,foundItem){

      foundItem.items.push(newItemName);
      foundItem.save(function(err){;
      res.redirect("/" + listHeading);});
    })
    
  }


});

// Item.deleteOne({name:req.body.checkbox},function(err){
//   if(err)
//     console.log(err);
//   else
//     console.log("Deleted Successfully");
// });

app.post("/delete",function(req,res){

  const itemDelete = req.body.checkbox;
  const listHeader = req.body.listHeader;

  if( listHeader === "Today"){
    Item.findByIdAndDelete(itemDelete,function(err,found){
      if(err)
        console.log(err);
      else
        console.log(found);
      })

    res.redirect("/");

  }
  else{

    List.findOneAndUpdate({ name:listHeader },{ $pull:{ items:{ _id:itemDelete }}},function(err,found){
      if(!err)
        res.redirect("/" + listHeader);
    })

  }


});


app.listen(3000, function () {
  console.log("Server started on port 3000");
});
