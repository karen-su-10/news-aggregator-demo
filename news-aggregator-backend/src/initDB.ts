import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

(async () => {
    const db = await open({
        filename: './news.db',
        driver: sqlite3.Database
    });

    await db.exec(`
    CREATE TABLE IF NOT EXISTS news (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      date TEXT,
      state TEXT,
      description TEXT,
      link TEXT,
      topic TEXT
    )
  `);

    console.log('Database initialized');
})();