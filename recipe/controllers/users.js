

const User = require('../models/user')
module.exports.renderRegister = (req,res)=>{
    res.render('user/register')
}

module.exports.register = async(req,res)=>{
    try{
    const {email, password, username} = req.body;
    const user =new User({email, username});
    const userRegistered = await User.register(user, password);
    res.login(userRegistered, err=>{
        if(err) return next(err);
        req.flash("welcome!");
        res.redirect('/campgrounds')
    })
    
    
    }catch(e){
        req.flash('error', e.message);
        res.redirect('register')
    }
    
    
}

module.exports.renderLogin = (req, res)=>{
    res.render('users/login')

}

module.exports.login = (req, res)=>{
    req.flash('success', ' welcome back')
    const redirectUrl = req.session.returnTo ||'/campgrounds';
    delete req.session.returnTo
    res.render(user.redirectUrl)
    
}

module.exports.logout = (req,res)=>{
    req.logout();
    req.flash("success", "goodbye")
    res.redirect('/campgrounds')
}
