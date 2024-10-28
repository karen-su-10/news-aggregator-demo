import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const dbPromise = open({
    filename: './news.db',
    driver: sqlite3.Database
});

export const getNewsFromDB = async (state?: string, topic?: string, search?: string, limit: number = 10, offset: number = 0) => {
    const db = await dbPromise;
    let query = 'SELECT * FROM news WHERE 1=1';
    if (state) query += ` AND state = '${state}'`;
    if (topic) query += ` AND topic = '${topic}'`;
    if (search) query += ` AND (title LIKE '%${search}%' OR description LIKE '%${search}%')`;
    query += ` LIMIT ${limit} OFFSET ${offset}`;
    return db.all(query);
};

export const countNewsFromDB = async (state?: string, topic?: string, search?: string): Promise<number> => {
    const db = await dbPromise;
    let query = 'SELECT count(*) as total_count FROM news WHERE 1=1';
    if (state) query += ` AND state = '${state}'`;
    if (topic) query += ` AND topic LIKE '%${topic}%'`;
    if (search) query += ` AND (title LIKE '%${search}%' OR description LIKE '%${search}%')`;
    const result = await db.get(query);
    return result.total_count;
};

export const getNewsByIdFromDB = async (id: string) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM news WHERE id = ?', id);
};

export const addNewsToDB = async (newsData: any) => {
    const db = await dbPromise;
    const { title, date, state, description, link, topic } = newsData;

    // Check if the article already exists
    const existingArticle = await db.get(
        'SELECT * FROM news WHERE title = ?',
        [title]
    );

    if (existingArticle) {
        return { message: 'Article already exists', ...existingArticle };
    }
    const result = await db.run(
        'INSERT INTO news (title, date, state, description, link, topic) VALUES (?, ?, ?, ?, ?, ?)',
        [title, date, state, description, link, topic]
    );
    return { id: result.lastID, ...newsData };
};