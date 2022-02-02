import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from './pages/index';
import VideoList from './components/VideoList';
import Video from './pages/video';

import './index.css';

render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/video/:id" element={<Video />} />
        <Route path="/" element={<Index />}>
          <Route path='/category/:name' element={<VideoList />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

