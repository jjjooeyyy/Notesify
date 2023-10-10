const Note = require("../models/Notes");
const mongoose = require("mongoose");

// Function to truncate text while preserving whole characters
const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) {
    return text;
  }
  const truncated = text.substr(0, maxLength);
  return truncated.substr(0, truncated.lastIndexOf(' ')) + '...';
};

// Define the escapeRegExp function
const escapeRegExp = (text) => {
  if (text) {
    // Exclude backslash (\) from escaping to allow special characters
    return text.replace(/[-[\]{}()*+?.,^$|#\s]/g, (match) => {
      if (match === '\\') {
        return match; // Don't escape backslash
      }
      return `\\${match}`; // Escape other special characters
    });
  }
  return '';
}; 

// GET Dashboard
exports.dashboard = async (req, res) => {
  let perPage = 8;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free Notes App",
  };

    try {
    if (!req.user) {
      // Handle the case where there's no authenticated user
      return res.redirect("views/401.ejs"); 
    }
    
    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: {
            $substrBytes: [
              "$title",
              0,
              100 * 4, // Truncate titles to 100 characters
            ],
          },
          body: {
            $substrBytes: [
              "$body",
              0,
              200 * 4, // Truncate bodies to 200 characters
            ],
          },
        },
      },
    ])
    .skip(perPage * page - perPage)
    .limit(perPage)
    .exec();
    
    const count = await Note.count();
    console.log(req.user); // Log the req.user object

    // Truncate the title and body fields in each note
    notes.forEach((note) => {
      note.title = truncateText(note.title, 100);
      note.body = truncateText(note.body, 200);
    });

    res.render("dashboard/index", {
      userName: req.user.firstName, // Assuming firstName is the correct property for the user's name
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    // Handle the error, perhaps by rendering an error page
    // res.status(500).render('views/login-failure.ejs'); // Example: Render a generic error page
  }
};

// View specific notes
exports.dashboardViewNote = async (req, res) => {
  const id = req.params.id;
  const note = await Note.findById({ _id: id })
    .where({ user: req.user.id })
    .lean();
  if (note) {
    res.render("dashboard/view-notes.ejs", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.render("../views/401.ejs");
  }
};

// Update specific notes
exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      { _id: req.params.id },
      { body: req.body.body, updatedAt: Date.now() }
    ).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// Delete specific notes
exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({ user: req.user.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// Get Add Route
exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add.ejs", { layout: "../views/layouts/dashboard" });
};

// POST new note
exports.dashboardSubmitNote = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// Get Search
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search.ejs", {
      searchResults: "",
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
  }
};

// POST search
exports.dashboardPostSearch = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    
    // Create a Unicode-aware regular expression
    const regex = new RegExp(searchTerm, 'iu');

    const searchResults = await Note.find({
      // Use the Unicode-aware regular expression in your queries
      $or: [
        { title: { $regex: regex } },
        { body: { $regex: regex } },
      ],
    }).where({ user: req.user.id });

    res.render('dashboard/search', {
      searchResults,
      layout: "../views/layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    // Handle the error, perhaps by rendering an error page
    // res.status(500).render('views/error.ejs'); // Example: Render a generic error page
  }
};
