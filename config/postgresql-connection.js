const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "wirex_db",
  password: "Shrey0309", 
  port: 5432,
});

// ✅ Log successful DB connection
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL");
});

// ❌ Handle DB connection errors
pool.on("error", (err) => {
  console.error("❌ Database connection error:", err.message);
  process.exit(1);
});

// ✅ Function to check DB connection before starting the server
const checkConnection = async () => {
  try {
    const client = await pool.connect();
    client.release();
    console.log("✅ Database connection verified");
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
};

//to check if i am getting the data from the db
// pool.query('select * from users', (err,res)=>{
//     if(!err){
//         console.log(res.rows)
//     }
// })

module.exports = { pool, checkConnection };
