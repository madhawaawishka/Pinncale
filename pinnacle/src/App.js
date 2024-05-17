import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Homepage';
import Stream from './pages/Streampage';
import Game from './pages/Gamepage';
import Community from './pages/Communitypage';
import Support from './pages/Support';
import Leaderboard from './pages/Leaderboardpage';
import Cart from './pages/Cartpage';
import Premiumplanes from './pages/Premiumplanepage';
import Myaccount from './pages/Myaccount';
import Payment from './pages/Payment';
import GameDetailsPage from './pages/GameDetailsPage';
import StreamDetailsPage from './pages/StreamDetailsPage';
import Register from './pages/Register';
import Login from './pages/Login';
import Leaderboardminigames from './pages/Leaderboardminigames';
import UpdateFeedback from './UpdateFeedback'


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>}></Route>
          <Route path='/stream' element={<Stream/>}></Route>
          <Route path='/streamdetail' element={<StreamDetailsPage/>}></Route>
          <Route path='/game' element={<Game/>}></Route>
          <Route path='/gamedetail' element={<GameDetailsPage/>}></Route>
          <Route path='/community' element={<Community/>}></Route>
          <Route path='/support' element={<Support/>}></Route>
          <Route path='/leaderboard' element={<Leaderboard/>}></Route>
          <Route path='/cart' element={<Cart/>}></Route>
          <Route path='/premiumplanes' element={<Premiumplanes/>}></Route>
          <Route path='/account' element={<Myaccount/>}></Route>
          <Route path='/payment' element={<Payment/>}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path='/leaderboardminigame' element={<Leaderboardminigames/>}></Route>
          <Route path='/updatefeedback/:id' element={<UpdateFeedback/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
