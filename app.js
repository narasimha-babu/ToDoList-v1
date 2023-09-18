//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require('mongoose');
const _ = require('lodash');

mongoose.connect("mongodb://127.0.0.1:27017/toDoListDB", {useNewUrlParser: true});

// const date = require(__dirname + '/date.js')




app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

var items = [];
var count = 0;


// mongoose

const itemsSchema = {
  name: {
    type: String
   
  }
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Welcome to toDoListApp"
});

const item2 = new Item({
  name: "Hit + to add an item"
});

const item3 = new Item({
  name: "<---- Hit this to strike off an item"
});

const defaultItems = [item1, item2, item3];

// listSchema
const listSchema = {
  name: String,
  items: [itemsSchema]
}

const List = mongoose.model("List", listSchema);

//routes
app.get("/", function (req, res) {
  // var day = date.getDay();
  // day = "Sunday"

  Item.find().then( function(items){
    
    if(items.length === 0){
      Item.insertMany(defaultItems).then( ()=>{console.log("Default Items Added Successfully");}).catch( (err)=>{console.log(err);} );

      res.redirect("/");
    }else{
    res.render("list", { listTitle: "Today", newListItem: items }); 
    }
  } );
});

app.get("/:customListName", function(req, res){
  const customListName = _.capitalize( req.params.customListName );
  // customListName = 

  List.findOne({name: customListName}).then( (foundList) => {
        if(!foundList){
          

          //create List
          const list = new List({
            name: customListName,
            items: defaultItems
          });

          list.save();
          // console.log(foundList);
          res.redirect("/" + customListName);
        }else{
          //List exists
          res.render("list", { listTitle: foundList.name, newListItem: foundList.items });
            
        }
  } ).catch( err =>{console.log(err);} );



});



app.get("/about", (req, res)=>{
  // var day = date();
  res.render("about", { listTitle: "Today"});
})

app.post("/", function(req, res){
  var newItem = req.body.newItem ;
  var listName = req.body.list;

  const nItem = new Item({
    name: newItem
  });

 

  if(listName === "Today"){
    nItem.save();
    res.redirect("/");
  }else{
    List.findOne({name: listName}).then( (foundList)=>{ 
      foundList.items.push(nItem);
      foundList.save();
      res.redirect("/" + listName);
    } ).catch( (err)=>{console.log(err);} );
  }
});

app.post("/delete", (req,res)=> {
  const deleteItemId = req.body.checkBox;
  const listName = req.body.listName
  // Item.deleteOne({_id: deleteItemId}).then( ()=>{console.log("Item Deleted Successfully");} ).catch( (err)=>{console.log(err);} );

  if(listName === "Today"){
    Item.findByIdAndRemove(deleteItemId).then( ()=>{console.log("Item Deleted Successfully");} ).catch( (err)=>{console.log(err);} );

    res.redirect("/");
  }else{
    List.updateOne({name: listName}, {$pull: {items: {_id: deleteItemId}}}).then( ()=>{console.log("Deleted Successfully");} ).catch( (err)=>{console.log(err);} );

    res.redirect("/" + listName);
  }
  
});


app.listen(4000, function () {
  console.log("Server started on port 4000");
});
