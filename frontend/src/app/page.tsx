'use client';

import React from 'react';
import { GraphContainer } from '../components/Graph/GraphContainer';
import '../styles/graph.css';

export default function Home() {
    return (
        <div className="app-container">
            <GraphContainer />
        </div>
    );
}
