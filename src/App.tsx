import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Main from './components/main/Main';
import FeaturesSection from './components/FeaturesSection/FeaturesSection';
import Feed from './components/Feed/Feed';
import PostDetail from './components/PostDetail/PostDetail';
import UserProfile from './components/UserProfile/UserProfile';
import Footer from './components/Footer/Footer';
import LoadingScreen from './components/LoadingScreen/LoadingScreen';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingScreen onLoadingComplete={handleLoadingComplete} />;
  }

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#302209] via-[#302209] to-[#302209] pt-6">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={
              <>
                <Main />
                <FeaturesSection />
                <Feed />
              </>
            } />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/user/:userId" element={<UserProfile />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
