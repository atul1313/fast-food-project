import Login from './Login/Login';
import '../src/css/index.css'
import MyOrder from './components/MyOrder';
import Changepassword from './components/Changepassword';
import HeaderState from './context/Usercontext';
import Layout from './layout/Layout';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Forgotpassword from './components/Forgotpassword';
import Register from './Login/Register';



function App() {
  return (
    <>

      <HeaderState>
        <BrowserRouter>
          <Routes>
            <Route path="/*" element={<Layout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myorder" element={<MyOrder />} />
            <Route path="/forgotpassword" element={<Forgotpassword />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </BrowserRouter>
      </HeaderState>
    </>
  );
}

export default App;
