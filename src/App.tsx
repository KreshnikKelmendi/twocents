import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Main from './components/main/Main';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import Feed from './components/Feed/Feed';
import PostDetail from './components/PostDetail/PostDetail';

function App() {
  return (
    <Router>
      <div className=" bg-gradient-to-br from-[#302209] via-[#302209] to-[#302209] pt-6">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <Main />
              <FeaturesSection />
              <Feed />
            </>
          } />
          <Route path="/post/:postId" element={<PostDetail />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
