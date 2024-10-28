import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import NewsList from './components/NewsList';
import FilterSearch from './components/FilterSearch';
import NewsDetails from './components/NewsDetails';
import Pagination from './components/Pagination';
import { Article } from './types/Article';

const App: React.FC = () => {
    const [articles, setArticles] = useState<Article[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalArticles, setTotalArticles] = useState(0);
    const [currentFilters, setCurrentFilters] = useState<{ state?: string; topic?: string; keyword?: string }>({});
    const articlesPerPage = 8;

    useEffect(() => {
        fetchNews(currentPage, currentFilters);
    }, [currentPage, currentFilters]);

    const fetchNews = async (page: number, filters?: { state?: string; topic?: string; keyword?: string }) => {
        const offset = (page - 1) * articlesPerPage;
        let query = `offset=${offset}&limit=${articlesPerPage}`;
        if (filters) {
            if (filters.state) query += `&state=${filters.state}`;
            if (filters.topic) query += `&topic=${filters.topic}`;
            if (filters.keyword) query += `&search=${filters.keyword}`;
        }
        try {
            const response = await axios.get(`http://localhost:3001/news?${query}`);
            console.log('News:', response.data);
            setArticles(response.data.articles);
            setFilteredArticles(response.data.articles);
            setTotalArticles(response.data.totalArticles);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const handleFilterChange = (filters: { state: string; topic: string; keyword: string }) => {
        setCurrentFilters(filters);
        setCurrentPage(1); // Reset to first page on filter change
        fetchNews(1, filters); // Fetch news for the first page with new filters
    };

    const handleArticleClick = (article: Article) => {
        setSelectedArticle(article);
    };

    const handleBack = () => {
        setSelectedArticle(null);
    };

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="container">
            <h1 className="my-4">News Aggregator</h1>
            {selectedArticle ? (
                <NewsDetails article={selectedArticle} onBack={handleBack} />
            ) : (
                <>
                    <FilterSearch onFilterChange={handleFilterChange} />
                    <NewsList articles={filteredArticles} onArticleClick={handleArticleClick} />
                    <Pagination
                        articlesPerPage={articlesPerPage}
                        totalArticles={totalArticles}
                        currentPage={currentPage}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default App;