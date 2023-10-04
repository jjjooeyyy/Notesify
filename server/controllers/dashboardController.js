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
      { $match: { user:new mongoose.Types.ObjectId(req.user.id) } },
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

    res.render('dashboard/index', {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "../views/layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage)
    });
  } catch (error) {
    console.log(error);
  }
};
