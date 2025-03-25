'use client';

import React from 'react';
import { GraphContainer } from '../components/Graph/GraphContainer';
import '../styles/graph.css';
import '../styles/modal.css';

export default function Home() {
    return (
        <main className="app-container">
            <GraphContainer />
        </main>
    );
}
