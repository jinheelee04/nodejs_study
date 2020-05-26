exports.home = function(req, res){
    res.render("home", {title: "EJS TEST PAGE"});
}

exports.signUp = function(req, res){
    res.render('sign_up', {title:'sign up page'});
}