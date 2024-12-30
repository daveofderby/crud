const exp = require("constants");
const express = require("express");
const app = express();
const path = require("path");
const { v4: uuid } = require("uuid");
const methodOverride = require("method-override");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

let data = [
  {
    id: "dave",
    username: "Dave",
    comment: "This web app development is easier the more you do it",
  },
  {
    id: uuid(),
    username: "Max",
    comment: "The food at Nottingham hospital isn't that bad",
  },
  {
    id: uuid(),
    username: "Nurse",
    comment: "This room is like walking into a Dutch Oven",
  },
];

const logUrl = (req, res, next) => {
  console.log(req.path);
  next();
};

app.get("/comments/new", (req, res) => {
  res.render("comments/new");
});

app.post("/comments", (req, res) => {
  const { username, comment } = req.body;
  data.push({ id: uuid(), username, comment });
  res.redirect("/comments");
});

app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = data.find((comment) => {
    if (comment.id === id) {
      return comment;
    }
  });
  res.render("./comments/edit", { ...comment });
});

app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const newComment = req.body.comment;
  const foundComment = data.find((comment) => {
    if (comment.id === id) {
      return comment;
    }
  });
  foundComment.comment = newComment;
  res.redirect(303, "/comments");
});

app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  console.log("delete route");
  data = data.filter((comment) => {
    if (comment.id !== id) {
      return comment;
    }
  });
  res.redirect(303, "/comments");
});

app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = data.find((comment) => {
    if (comment.id === id) {
      return comment;
    }
  });
  res.render("./comments/show", { ...comment });
});

app.get("/", (req, res) => {
  res.render("home", { name: "Dave" });
});

app.get("/comments", (req, res) => {
  res.render("./comments/index", { data });
});

app.use((req, res) => {
  res.send(`Invalid URL`);
});

console.log("listing on port 3000");
app.listen(3000);
