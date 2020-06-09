
exports.basic= (req,res) =>{
    res.render('naver/basic', { title: 'naver map api' });
}

exports.overlay= (req,res) =>{
    res.render('naver/overlay', { title: 'naver map api' });
}

exports.index= (req,res) =>{
    res.render('naver/index', { title: '출입자 보안 관제' });
}