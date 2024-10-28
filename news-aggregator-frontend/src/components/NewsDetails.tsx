import React from 'react';
import './NewsDetails.css';

interface Article {
    title: string;
    description: string;
    state: string;
    topic: string;
    date: string;
    link: string;
}

interface NewsDetailsProps {
    article: Article | null;
    onBack: () => void;
}

const NewsDetails: React.FC<NewsDetailsProps> = ({ article, onBack }) => {
    if (!article) return null;

    const isPromoted = article.title.includes('[Promoted content]');
    const cleanTitle = article.title.replace('[Promoted content]', '').trim();

    return (
        <div className="card">
            <div>
                <button className="btn btn-secondary back-btn-float-right" onClick={onBack}>Back</button>
            </div>
            <div className="card-body">
                <h2 className="card-title">
                    {cleanTitle}
                    {isPromoted && <span title="promoted"> *</span>}
                </h2>
                <p className="card-text">{article.description}</p>
                <p className="card-text"><small
                    className="text-muted">{article.state} - {article.topic} - {new Date(article.date).toLocaleDateString()}</small>
                </p>
                <a href={article.link} target="_blank" rel="noopener noreferrer" className="btn btn-primary">Read
                    more</a>
            </div>
        </div>
    );
};

export default NewsDetails;