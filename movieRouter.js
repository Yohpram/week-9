
const express = require('express');
const pool = require('./query.js');
const router = express.Router();
const { authorize } = require ('../week-9/middwares/auth.js')
const app = express()

router.use(authorize);

router.get('/', async (req, res) => {

  console.log('masuk route get movie')
  try {
    // Eksekusi permintaan SQL ke database
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM public.movies');
    client.release(); // Kembalikan koneksi ke pool

    // Kirim hasil ke client sebagai respons JSON
    res.status(200).json({ message: 'success', result: result.rows });
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/peg', async (req, res, next) => {
  
  try {
    // Membuka koneksi database
    const client = await pool.connect();

    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) || 10; // .
    const offset = (page - 1) * limit; 

    const query = 'SELECT * FROM public.movies LIMIT $1 OFFSET $2';
    const values = [limit, offset];

    const { rows } = await client.query(query, values);

    // Menutup koneksi database
    client.release();

    res.status(200).json(rows);
  } catch (err) {
    next(err)
  }
  });




router.post('/:movieId', async (req, res) => {
    try {
      const {id, title, genres, year} = req.body;
      const query = 'INSERT INTO public.movies (id, title, genres, year) VALUES ($1, $2, $3, $4)';
      const values = [id, title, genres, year];
  
      const { rows } = await pool.query(query, values);
  
      if (rows) {
        res.status(200).json({ message: 'Movie data inserted successfully' });
      }
    } catch (err) {
      console.error(err);
  
      if (err.message === 'database') {
        res.status(500).json({ error: 'Problem with database' });
      } else if (err.message.includes('authorize')) {
        res.status(401).json({ error: 'Problem with user authorization' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

router.put('/:movieId', async (req, res) => {
    try {
      const { title, year, genres } = req.body;
      const movieId = req.params.movieId;
  
      const query = 'UPDATE public.movies SET title = $1, year = $2, genres = $3 WHERE id = $4';
      const values = [title, year, genres, movieId];
  
      const { rowCount } = await pool.query(query, values);
  
      if (rowCount > 0) {
        res.status(200).json({ message: 'Movie data updated successfully' });
      } else {
        res.status(404).json({ error: 'Movie not found' });
      }
    } catch (err) {
      console.error(err);

      if (err.message === 'database') {
        res.status(500).json({ error: 'Problem with database' });
      }  else {
        if (err.message && err.message.includes('authorize')) {
          res.status(401).json({ error: 'Problem with user authorization' });
        }
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  });

router.delete('/:movieId', async (req, res) => {
        try {
          const movieId = req.params.movieId;
          const query = 'DELETE FROM public.movies WHERE id = $1';
          const values = [movieId];
          
          const result = await pool.query(query, values);
      
          if (result.rowCount > 0) {
            res.status(200).json({ message: 'Movie deleted successfully' });
          } else {
            res.status(404).json({ error: 'Movie not found' });
          }
        } catch (err) {
          console.error(err);
          res.status(500).json({ error: 'Internal server error' });
        }
      });



module.exports = router;
