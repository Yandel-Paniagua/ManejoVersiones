const express = require("express");
const router = express.Router();
const User = require("../models/users");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { resourceLimits } = require("worker_threads");

const carpetaUpload = path.join(__dirname, "../upload"); //path del directorio donde se guardarán las imagenes

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, carpetaUpload);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname + "-" + Date.now());
  },
});

// Mantener campos requeridos consistentes

var upload = multer({
  storage: storage,
}).single("image");

router.get("/", async (req, res) => {
  try {
    const users = await User.find({});
    res.render("index", { titulo: "Inicio", users: users });
  } catch (err) {
    res.json({ message: err.message });
  }
});

router.get("/add", (req, res) => {
  res.render("adduser", { titulo: "Agregar Usuario" });
});

//AQUI
router.post("/add", upload, async (req, res) => {
  const user = new User({
    code: req.body.code,
    name: req.body.name,
    image: req.file.filename,
    descripcion: req.body.descripcion,
    cantidad: req.body.cantidad,
    precio: req.body.precio,
  });
  user
    .save()
    .then(() => {
      console.log("Guardado correctamente");

      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
});

//editar
router.get("/edit/:id", async (req, res) => {
  const id = req.params.id.trim();

  try {
    const user = await User.findById(id);

    if (user == null) {
      res.redirect("/");
    } else {
      res.render("edituser", { titulo: "Editar articulo", user: user });
    }
  } catch (err) {
    //
    res.json({ message: err.message });
  }
});

router.post("/update/:id", upload, async (req, res) => {
  const id = req.params.id.trim();
  let new_image = "";

  if (req.file) {
    new_image = req.file.filename;

    try {
      fs.unlinkSync("./upload/" + req.body.old_image);
    } catch (err) {
      console.log(err);
    }
  } else {
    new_image = req.body.old_image;
  }

  try {
    await User.findByIdAndUpdate(id, {
      name: req.body.name,
      image: new_image,
      descripcion: req.body.descripcion,
      cantidad: req.body.cantidad,
      precio: req.body.precio,
    });
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
});

//borrar
router.get("/delete/:id", async (req, res) => {
  const id = req.params.id.trim();

  try {
    const user = await User.findByIdAndDelete(id);
    res.redirect("/");

    if (user == null && user.image != "") {
      try {
        fs.unlinkSync("./upload/" + resourceLimits.image);
      } catch (err) {
        console.log(err);
      }
    }
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
