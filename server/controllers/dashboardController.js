// GET Dashboard
exports.dashboard = async(req,res)=> {
    const locals = {
        title: "Dashboard",
        description: "Free Notes App"
    }
    res.render('dashboard/index.ejs',{locals,layout:'../views/layouts/dashboard'})
}
