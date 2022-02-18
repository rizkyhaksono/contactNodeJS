const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const { body, validationResult, check } = require("express-validator");
const methodOverride = require("method-override");

require("./utils/db");
const Contact = require("./model/contact");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const app = express();
const port = 3000;

// Setup method override
app.use(methodOverride("_method"));

// Setups EJS
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// Routes
app.get("/", (req, res) => {
  res.render("index", {
    layout: "layouts/main-layout",
    nama: "Rizky Haksono",
    title: "Home Page",
  });
});

app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "About Page",
  });
});

app.get("/contact", async (req, res) => {
  const contacts = await Contact.find();

  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Contact Page",
    contacts: contacts,
    msg: req.flash("msg"),
  });
});

// Add new data contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    layout: "layouts/main-layout",
    title: "Add Contact",
  });
});

// Process add new data contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplicate = await Contact.findOne({ nama: value });
      if (duplicate) {
        throw new Error("Your name is already taken!");
      }
      return true;
    }),
    check("email", "Your email is not valid!").isEmail(),
    check("nomor", "Your phone number is not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        layout: "layouts/main-layout",
        title: "Add Contact",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (err, result) => {
        req.flash("msg", "Successfully added contact!");
        res.redirect("/contact");
      });
    }
  }
);

// Delete data contact
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Successfully deleted contact!");
    res.redirect("/contact");
  });
});

// Edit data contact
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("edit-contact", {
    layout: "layouts/main-layout",
    title: "Edit Contact",
    contact: contact,
  });
});

// Proses edit data contact
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplicate = await Contact.findOne({ nama: value });
      if (value !== req.body.oldName && duplicate) {
        throw new Error("Your name is already taken!");
      }
      return true;
    }),
    check("email", "Your email is not valid!").isEmail(),
    check("nomor", "Your phone number is not valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        layout: "layouts/main-layout",
        title: "Edit Contact",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nomor: req.body.nomor,
          },
        }
      ).then((result) => {
        req.flash("msg", "Successfully updated contact!");
        res.redirect("/contact");
      });
    }
  }
);

// Detail data contact
app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({
    nama: req.params.nama,
  });

  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Detail Page",
    contact: contact,
  });
});

app.listen(port, () => {
  console.log(`Server started on port http://localhost:${port}`);
});
