//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const timeMa = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.locals.currentTime = timeMa.currentTime();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useNewUrlParser: true,
});

const itemsSchema = {
  name: String,
  urgent: Boolean,
  important: Boolean,
  timeNeed: Number,
};
const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "THIS IS AN EXAMPLE OF TODOLIST ITEM",
  urgent: true,
  important: true,
  timeNeed: 5,
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
  urgent: true,
  important: true,
  timeNeed: 3,
});

const item3 = new Item({
  name: "Hit THE LEFT BLANK PANE to delete an item.",
  urgent: false,
  important: true,
  timeNeed: 2,
});

const defaultItems = [item1, item2, item3];

const librarySchema = {
  title: String,
  url: String,
};

const Library = mongoose.model("Library", librarySchema);

const lib1 = new Library({
  title: "THIS IS AN EXAMPLE OF RESOURCE ITEM",
  url: "www.google.com",
});

const lib2 = new Library({
  title: "Hit the PUBLISH button to add a new item.",
  url: "www.google.com",
});

const lib3 = new Library({
  title: "<-- Hit this to delete an item.",
  url: "www.google.com",
});

const tempLibItems = [lib1, lib2, lib3];

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("items added to databse.");
        }
      });
      res.redirect("/");
    } else {
      // console.log(foundItems);
      const today = new Date();
      var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
      };

      var day = today.toLocaleDateString("en-AU", options);
      res.render("list", {
        listTitle: day,
        newListItems: foundItems,
        theTimer: "currentTime",
      });
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName,
  });

  item.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Item.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(checkedItemId + " deleted");
      res.redirect("/");
    }
  });
  console.log(checkedItemId);
});

app.get("/about", function (req, res) {
  res.render("about", { listTitle: "dafsf", newListItems: [] });
});

app.get("/music", function (req, res) {
  res.render("musicPlayer");
});

app.get("/taskTable", function (req, res) {
  Item.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("items added to databse.");
        }
      });
      res.redirect("/");
    } else {
      var item1 = "";
      var item2 = "";
      var item3 = "";
      var item4 = "";
      foundItems.forEach(function (item) {
        if (item.urgent === true && item.important === true) {
          item1 = item;
        } else if (item.urgent === true && item.important === false) {
          item2 = item;
        } else if (item.urgent === false && item.important === true) {
          item3 = item;
        } else {
          item4 = item;
        }
      });
      res.render("taskTable", {
        listTitle: " ",
        newListItems: foundItems,
        item1: item1,
        item2: item2,
        item3: item3,
        item4: item4,
      });
    }
  });
  // res.render("taskTable", { listTitle: "Task Table", newListItems: [] });
});

app.get("/library", function (req, res) {
  Library.find({}, function (err, foundItems) {
    if (foundItems.length === 0) {
      Library.insertMany(tempLibItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("items added to databse.");
        }
      });
      res.redirect("/library");
    } else {
      console.log(foundItems);
      res.render("library", { libToDisplay: foundItems });
    }
  });
});

app.post("/library", function (req, res) {
  const lib = new Library({
    title: req.body.postTitle,
    url: req.body.postBody,
  });

  lib.save();

  res.redirect("/library");
});

app.post("/deleteLib", function (req, res) {
  const checkedItemId = req.body.checkbox;

  Library.findByIdAndRemove(checkedItemId, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log(checkedItemId + " deleted");
      res.redirect("/library");
    }
  });
  console.log(checkedItemId);
});

// Timer

app.listen(3000, function () {
  console.log("Server started on port 3000");
});

// app.get("/:customListName", function (req, res) {
//   const customListName = req.params.customListName;

//   List.findOne({ name: customListName }, function (err, found) {
//     if (!err) {
//       if (!found) {
//         const list = new List({
//           name: customListName,
//           items: defaultItems,
//         });
//         list.save();
//         res.redirect("/" + customListName);
//       } else {
//         console.log(found);
//         res.render("list", {
//           listTitle: found.name,
//           newListItems: found.items,
//         });
//       }
//     }
//   });
// });

// const listSchema = {
//   name: String,
//   items: [itemsSchema],
// };

// const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems, function (err) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log("connection established.");
//   }
// });

// <input
// name="checkbox"
// type="checkbox"
// value="<%=item._id%>"
// onChange="this.form.submit()"
// />
