'use client';

import React from 'react';
import { GraphContainer } from '../components/Graph/GraphContainer';
import 'reactflow/dist/style.css';
import '../styles/global.css';
import '../styles/graph.css';
import '../styles/modal.css';

export default function Home() {
    return (
        <div className="app-container">
            <GraphContainer />
        </div>
    );
}
