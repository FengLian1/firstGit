const hasAccess = (req,res,next)=>
{
    if(req.session.user==null)
    {
        res.redirect("/User/login");
    }
    else
    {
        next();
    }
}

module.exports=hasAccess;