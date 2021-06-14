const User = require('../models/user');

module.exports.userRenderRegister = (req,res) => {
    res.render('users/register')
}

module.exports.userRegisterForm = async (req,res) => {
  
    try{
        const {username,password,email} = req.body;
        const user = new User({email,username});
        const registeredUser = await User.register(user,password);
        req.login(registeredUser,err => {
            if(err) return next(err);
            req.flash('Success','Welcome to Restaurofind');
            res.redirect('/campgrounds')
        })
        
    }
    catch(e){
        req.flash('error',e.message);
        res.redirect('register')
    }
}

module.exports.renderLogin = (req,res) => {
    req.flash('Success','Welcome back')
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(redirectUrl)
}

module.exports.getLogin = (req,res) => {
    res.render('users/login');
}


module.exports.logout = (req,res) => {
    req.logout();
    req.flash('Thanks for using Restaurofind!!, Hope you come back again')
    res.redirect('/campgrounds')
}