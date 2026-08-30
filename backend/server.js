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
  user: process.env.DB_USER,      // ← было process.env.USER
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,  // ← было process.env.DB
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

app.post("/api/meetings", async (req, res) => {
  const { date, time, blocks } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO meetings (date, time) VALUES ($1, $2) RETURNING id",
      [date, time]
    );

    const meetingId = result.rows[0].id;

    for (let i = 0; i < blocks.length; i++) {

      const result = await pool.query(
        "INSERT INTO meeting_blocks (meeting_id, type, description) VALUES ($1, $2, $3) RETURNING id",
        [meetingId, blocks[i].type, blocks[i].description]);

      const block_id = result.rows[0].id;
      const currParticipants = blocks[i].participants;

      for (let j = 0; j < currParticipants.length; j++) {
        const result = await pool.query("INSERT INTO block_participants (block_id, employee_id) VALUES ($1, $2)",
          [block_id, currParticipants[j]]);
      }
    }

    res.status(201).json({ message: "OK", meetingId });

  } catch (err) {
    console.error("Ошибка при создании встречи:", err.message);
    res.status(500).json({ error: err.message });
  }

});

app.get("/api/employees", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, full_name from employees");
    res.json(result.rows);
  }
  catch (err) {
    res.status(500).json({ error: err.message });
  }
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