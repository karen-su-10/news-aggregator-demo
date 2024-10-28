import React, { useState } from 'react';
import { states } from '../types/states';
import './FilterSearch.css';

interface FilterSearchProps {
    onFilterChange: (filters: { state: string; topic: string; keyword: string }) => void;
}

const FilterSearch: React.FC<FilterSearchProps> = ({ onFilterChange }) => {
    const [state, setState] = useState('');
    const [topic, setTopic] = useState('');
    const [keyword, setKeyword] = useState('');

    const handleFilterChange = () => {
        onFilterChange({ state, topic, keyword });
    };

    return (
        <div className="mb-4">
            <div className="form-group row mb-2">
                <label htmlFor="state" className="col-sm-2 col-form-label bold-label">State</label>
                <div className="col-sm-10">
                    <select className="form-control fixed-width" id="state" value={state} onChange={(e) => setState(e.target.value)}>
                        <option value="">Select a state</option>
                        {Object.entries(states).map(([abbr, name]) => (
                            <option key={abbr} value={abbr}>{name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="form-group row mb-2">
                <label htmlFor="topic" className="col-sm-2 col-form-label bold-label">Topic</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control fixed-width" id="topic" value={topic}
                           onChange={(e) => setTopic(e.target.value)}/>
                </div>
            </div>
            <div className="form-group row mb-2">
                <label htmlFor="keyword" className="col-sm-2 col-form-label bold-label">Keyword</label>
                <div className="col-sm-10">
                    <input type="text" className="form-control fixed-width" id="keyword" value={keyword}
                           onChange={(e) => setKeyword(e.target.value)}/>
                </div>
            </div>
            <button className="btn btn-primary" onClick={handleFilterChange}>Filter</button>
        </div>
    );
};

export default FilterSearch;