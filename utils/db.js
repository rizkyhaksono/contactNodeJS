const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/rh", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// // Creating schema
// const Contact = mongoose.model("Contact", {
//   nama: {
//     type: String,
//     required: true,
//   },
//   nomor: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//   },
// });

// // Add new data
// const contact1 = new Contact({
//   nama: "rizkyaja",
//   nomor: "081223456789",
//   email: "rizkyaja@gmail.com",
// });

// // Save data
// contact1.save().then((contact) => console.log(contact));
