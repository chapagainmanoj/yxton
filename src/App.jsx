import React from 'react';
import { TopicsProvider } from './contexts/TopicsContext';
import TopicManager from './components/TopicManager';
import './styles/index.css';

const App = () => {
    return (
        <TopicsProvider>
            <div className="app-container">
                <TopicManager />
            </div>
        </TopicsProvider>
    );
};

export default App;