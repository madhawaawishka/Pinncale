import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admindashboard from './pages/Admindashboard';
import CreateFAQ from "./CreateFAQ";
import AdminFeedbackUpdate from "./components/AdminFeedbackUpdate";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route index element={<Admindashboard />}></Route>
          <Route path='/createfaq' element={<CreateFAQ/>}></Route>
          <Route path='/Adminfbupdate/:id' element={<AdminFeedbackUpdate/>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
