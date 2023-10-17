const express = require('express');
const router = express.Router();
const pool = require('../week-9/query')
const { generateToken } = require('../week-9/helpers/jwt')

router.get('/', function (req, res, next) {
   pool.query = ('SELECT * FROM public.users', (err, result) => {
 
  if(err) {
      next(err)
  } else {
    res.status(200).json(result)
  }
})

});


router.post('/register', function (req, res, next) {
    const { id, email, gender, password, role } = req.body;
    const query = 'INSERT INTO public.users (id, email, gender, password, role) VALUES ($1, $2, $3, $4, $5)';
    const values = [id, email, gender, password, role]; 
    pool.query(query, values, (err, result) => {
      if (err) {
        next(err)
      } else {
        res.status(200).json({ message: 'User registered successfully' });
      }
    });
  });
  
  router.get('/login', function (req, res, next) {
    const { email, password } = req.body;
  
    pool.query(`SELECT * FROM public.users WHERE email = '${email}' AND password = '${password}' `, (err, result) => {
      if (err) {
        next(err);
      } else {
        if (result.rows.length > 0) {
          const { email, password } = result.rows[0];
          const generateUserToken = generateToken({ email, password });
          res.status(200).json({ access_token: generateUserToken, result: result.rows[0] });
        } else {
          res.status(401).json({ error: 'Invalid email or password' });
        }
      }
    });
  });
module.exports = router;