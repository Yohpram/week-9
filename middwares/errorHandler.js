module.exports = {
    errorHandlers: (err, req, res, next) => {
        if(err){
            switch (err.name){
                case "SignInError":
                    res.status(401).json({massage: 'invalid username/password' })
                case "Unauthorize":
                    res.status(401).json({massage: 'you dont have access'})
                default:
                    res.status(500).json({massagr: 'internal server error'})
            }
        }
    }

    

}
