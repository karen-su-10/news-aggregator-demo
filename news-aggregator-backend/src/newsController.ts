import { Request, Response } from 'express';
import {fetchNews, fetchNewsById, createNews, fetchNewsCount} from './newsService';

/**
 * @swagger
 * /news:
 *   get:
 *     summary: Retrieve a list of news articles
 *     parameters:
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: The state of the news articles
 *       - in: query
 *         name: topic
 *         schema:
 *           type: string
 *         description: The topic of the news articles
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for the news articles
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: The number of news articles to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: The number of news articles to skip
 *     responses:
 *       200:
 *         description: A list of news articles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
export const getNews = async (req: Request, res: Response) => {
    const { state, topic, search, limit = 10, offset = 0 } = req.query;
    const newsData = await fetchNews(state as string, topic as string, search as string, parseInt(limit as string), parseInt(offset as string));
    const totalArticles = await fetchNewsCount(state as string, topic as string, search as string);
    console.log('Total articles:', totalArticles);
    res.status(200).json({
        totalArticles,
        articles: newsData
    });
};

/**
 * @swagger
 * /news/{id}:
 *   get:
 *     summary: Retrieve a single news article by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the news article
 *     responses:
 *       200:
 *         description: A single news article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export const getNewsById = async (req: Request, res: Response) => {
    const { id } = req.params;
    const news = await fetchNewsById(id);
    res.json(news);
};
/**
 * @swagger
 * /news:
 *   post:
 *     summary: Create a new news article
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               date:
 *                 type: string
 *               state:
 *                 type: string
 *               description:
 *                 type: string
 *               link:
 *                 type: string
 *               topic:
 *                 type: string
 *     responses:
 *       201:
 *         description: The created news article
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
export const addNews = async (req: Request, res: Response): Promise<void> => {
    const newsData = req.body;
    const result = await createNews(newsData);

    if (result.message === 'Article already exists') {
        res.status(409).json(result);
    } else {
        res.status(201).json(result);
    }
};