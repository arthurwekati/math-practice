import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './components/Home';
import Practice from './components/Practice';
import Review from './components/Review';
import Stats from './components/Stats';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/practice/:operation" element={<Practice />} />
          <Route path="/review" element={<Review />} />
          <Route path="/stats" element={<Stats />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
