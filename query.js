const Pool  = require('pg').Pool;
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'week-9',
  password: '1234',
  port: 5432,
});

// Tes koneksi ke database
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Kesalahan koneksi ke database:', err);
    } else {
      console.log('Berhasil terhubung ke database pada:', res.rows[0].now);
    }
  });

module.exports = pool;