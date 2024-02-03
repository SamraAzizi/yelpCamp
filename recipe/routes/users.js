const express = require("express")
const router = express.Router();
const passport = require('passport')
const user = require("../models/user");
const passport = require("passport");


router.get('/register', (req,res)=>{
    res.render('user/register')
})

router.post('/register', async(req,res)=>{
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
    
    
})

router.get('/login', (req, res)=>{
    res.render('users/login')

})

router.post('/login',passport.authenticate('local',{failureFlash:true, failureRedirect:'/login'}), (req, res)=>{
    req.flash('success', ' welcome back')
    const redirectUrl = req.session.returnTo ||'/campgrounds';
    delete req.session.returnTo
    res.render(user.redirectUrl)
    
})


router.get('/logout',(req,res)=>{
    req.logout();
    req.flash("success", "goodbye")
    res.redirect('/campgrounds')
})
module.exports = router;