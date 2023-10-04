const Note = require("../models/Notes");
const mongoose = require("mongoose");

// GET Dashboard
exports.dashboard = async (req, res) => {
  let perPage = 8;
  let page = req.query.page || 1;

  const locals = {
    title: "Dashboard",
    description: "Free Notes App",
  };

  try {
    /* fetching a list of notes from a MongoDB database, sorting them by the updatedAt field in descending order, filtering them to include only notes belonging to a specific user, projecting only a subset of fields for each note */

    const notes = await Note.aggregate([
      { $sort: { updatedAt: -1 } },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substr: ["$title", 0, 30] },
          body: { $substr: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await Note.count();

    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
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
        //removes any special characters (characters other than letters, numbers, and spaces)
        const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

        const searchResults = await Note.find({
            // $or : it will match notes where either the title or the body matches the search term (ignoring special characters).
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChars,'i')}},
                // 'i' for case-insensitive (it will match text regardless of whether the characters are in uppercase or lowercase.)
                {body: {$regex: new RegExp(searchNoSpecialChars,'i')}},
            ],
        }).where({user:req.user.id});

        res.render('dashboard/search',
        {searchResults,
        layout: "../views/layouts/dashboard"
        })
    }catch(error) {
        console.log(error);
    }
};
