import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import specs from './swaggerConfig';
import { addNews, getNewsById, getNews } from './newsController';

const app = express();

// middleware and routes
app.use(express.json());
app.use(cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.post('/news', addNews);
app.get('/news', getNews);
app.get('/news/:id', getNewsById);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});