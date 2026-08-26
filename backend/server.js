import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT;

const pool = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASS,
  port: process.env.DB_PORT,
});

app.get("/api/next-meeting", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        m.date,
        m.time,
        (
          SELECT json_agg(
            json_build_object(
              'type', mb.type,
              'description', mb.description,
              'participants', (
                SELECT json_agg(e.full_name)
                FROM block_participants bp
                JOIN employees e ON bp.employee_id = e.id
                WHERE bp.block_id = mb.id
              )
            )
          )
          FROM meeting_blocks mb
          WHERE mb.meeting_id = m.id
        ) AS blocks
      FROM meetings m
      WHERE m.date >= CURRENT_DATE
      ORDER BY m.date
      LIMIT 1
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Сервер запущен на порту ${port}`);
});