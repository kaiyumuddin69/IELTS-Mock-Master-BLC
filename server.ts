import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("ielts.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    name TEXT
  );

  CREATE TABLE IF NOT EXISTS tests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    type TEXT -- 'listening', 'reading', 'writing', 'speaking'
  );

  CREATE TABLE IF NOT EXISTS user_answers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_email TEXT,
    test_id INTEGER,
    module TEXT,
    answers TEXT, -- JSON string
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_email, test_id, module)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS idx_user_answers_unique ON user_answers (user_email, test_id, module);
`);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post("/api/save-answers", (req, res) => {
    const { email, testId, module, answers } = req.body;
    
    try {
      const stmt = db.prepare(`
        INSERT INTO user_answers (user_email, test_id, module, answers)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(user_email, test_id, module) DO UPDATE SET
        answers = excluded.answers,
        updated_at = CURRENT_TIMESTAMP
      `);
      
      stmt.run(email, testId, module, JSON.stringify(answers));
      res.json({ success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to save answers" });
    }
  });

  app.get("/api/get-answers", (req, res) => {
    const { email, testId, module } = req.query;
    const row = db.prepare("SELECT answers FROM user_answers WHERE user_email = ? AND test_id = ? AND module = ?").get(email, testId, module);
    res.json(row ? JSON.parse(row.answers) : {});
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
