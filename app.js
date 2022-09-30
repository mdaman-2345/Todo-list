const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose");
const _ = require("lodash");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://aman:aman@cluster0.b3z12ik.mongodb.net/?retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
mongoose.set("useFindAndModify", false);

const itemSchema = mongoose.Schema({
  name: String,
});

const listSchema = mongoose.Schema({
  name: String,
  item: [itemSchema],
});

const List = mongoose.model("List", listSchema);

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome",
});

const item2 = new Item({
  name: "press + to add item",
});

const item3 = new Item({
  name: "<-- to Delete",
});

const defaltListItem = [item1, item2, item3];

app.get("/", function (req, res) {
  Item.find({}, function (err, items) {
    if (!err) {
      if (items.length === 0) {
        Item.insertMany(defaltListItem, function (err) {
          if (err) console.log(err);
        });
        res.redirect("/");
      } else res.render("list.ejs", { titleOfPage: "Today", items: items });
    }
  });
});

app.get("/:listname", function (req, res) {
  const listname = _.capitalize(req.params.listname);

  List.findOne({ name: listname }, function (err, foundlist) {
    if (!err) {
      if (!foundlist) {
        const list = new List({
          name: listname,
          item: defaltListItem,
        });
        list.save();
        res.redirect("/" + listname);
      } else {
        res.render("list.ejs", {
          titleOfPage: listname,
          items: foundlist.item,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const newItem = req.body.newItem;
  const listname = req.body.list;
  const item = new Item({
    name: newItem,
  });

  if (listname === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listname }, function (err, list) {
      if (!err) {
        list.item.push(item);
        list.save();

        res.redirect("/" + listname);
      }
    });
  }
});

app.post("/delete", function (req, res) {
  const checkboxId = req.body.checkbox;
  const listname = req.body.listName;

  if (listname === "Today") {
    Item.findByIdAndRemove(checkboxId, function (err) {
      if (!err) {
        console.log("success");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listname },
      { $pull: { item: { _id: checkboxId } } },
      function (err, foundlist) {
        if (!err) {
          res.redirect("/" + listname);
        }
      }
    );
  }
});


let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("server is running");
});
