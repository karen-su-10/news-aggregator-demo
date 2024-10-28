import { getNewsFromDB,countNewsFromDB, getNewsByIdFromDB, addNewsToDB } from './newsModel';

export const fetchNews = async (state?: string, topic?: string, search?: string, limit: number = 10, offset: number = 0) => {
    return getNewsFromDB(state, topic, search, limit, offset);
};

export const fetchNewsCount = async (state?: string, topic?: string, search?: string): Promise<number> => {
    return countNewsFromDB(state, topic, search);
};

export const fetchNewsById = async (id: string) => {
    return getNewsByIdFromDB(id);
};

export const createNews = async (newsData: any) => {
    return addNewsToDB(newsData);
};