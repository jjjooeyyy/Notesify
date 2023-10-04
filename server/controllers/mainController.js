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

// GET Feature page
exports.features = async(req,res)=> {
    const locals = {
        title: "Features",
        description: "Free Notes App"
    }
    res.render('features.ejs',{locals})
}

// GET faq
exports.faq = async(req,res)=> {
    const locals = {
        title: "FAQ",
        description: "Free Notes App"
    }
    res.render('faq.ejs',{locals})
}