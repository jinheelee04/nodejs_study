

exports.google= (req,res) =>{
    res.render('vstrLocation/google', { title: '출입자 보안 관제 ' });
}
exports.naver= (req,res) =>{
    res.render('vstrLocation/naver', { title: '출입자 보안 관제 ' });
}
exports.kt= (req,res) =>{
    res.render('vstrLocation/kt', { title: '출입자 보안 관제 ' });
}
exports.kakao= (req,res) =>{
    res.render('vstrLocation/kakao', { title: '출입자 보안 관제 ' });
}