import React from 'react';
import { Article } from '../types/Article';
import 'bootstrap/dist/css/bootstrap.min.css';
import './NewsList.css'; // Import the CSS file

interface NewsListProps {
    articles: Article[];
    onArticleClick: (article: Article) => void;
}

const NewsList: React.FC<NewsListProps> = ({ articles, onArticleClick }) => {
    const truncateText = (text: string, maxLength: number) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    return (
        <div className="row">
            {articles.map(article => (
                <div key={article.title} className="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
                    <div className="card custom-card" onClick={() => onArticleClick(article)}>
                        <div className="card-body">
                            <h4 className="card-title left-align-title">{article.title.replace('[Promoted content]', '')}</h4>
                            <p className="card-text left-align-description">{truncateText(article.description, 300)}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default NewsList;