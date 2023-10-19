const { generateToken, verifyToken } = require('../helpers/jwt') // Import verifyToken
const pool = require('../query');

module.exports = {
  authenticate: async function (req, res, next) {
    try {

      // Periksa apakah rute yang sedang diakses adalah rute dokumentasi Swagger
      if (req.originalUrl === '/api-docs' || req.originalUrl.startsWith('/api-docs/')) {
        // Jika rute adalah rute dokumentasi Swagger, maka lanjutkan tanpa otentikasi
        return next();
      }

      const accessToken = req.headers.access_token

      const decoded = verifyToken(accessToken)

      const checkUser = await pool.query(`SELECT * FROM public.users WHERE email = '${decoded.email}' AND password = '${decoded.password}'`);

      console.log(checkUser.rows[0].role,'====>')

      if (checkUser) {
        req.role = checkUser.rows[0].role;
        next()
      } else {
        next({name: 'SignInerror'})
      }
    } catch (err) {
      next(err)
    } 
  },
  authorize: async function (req, res, next) { 
    try{
    const isSupervisor = req.role === 'Engineer'

    if(!isSupervisor){
        throw new Error;
    } else{
      next();
    }
  } catch (err){
      next({name: 'Unathorize'})

    }
  }
}
