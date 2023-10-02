// GET Homepage
exports.homepage = async(req,res)=> {
    const locals = {
        title: "Notesify",
        description: "Free Notes App"
    }
    res.render('index.ejs',{locals,layout:'../views/layouts/front-page'})
}

// GET About Page
exports.about = async(req,res)=> { 
    const locals = {
        title: "About Notesify",
        description: "Free Notes App"
    }
    res.render('about.ejs',{locals})
}