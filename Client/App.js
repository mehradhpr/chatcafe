import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Register from './Register';
import Channels from './Channels';
import ChannelPage from './ChannelPage';
import Channels_admin from './Channels_admin';
import AccountsList_admin from './AccountsList_admin';
import Find from './Find';

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Landing/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/user/:accountInfo" element={<Channels/>} />
      <Route path="/user/:accountInfo/channel/:channelInfo" element={<ChannelPage/>} />
      <Route path='/user/:accountInfo/find' element={<Find/>} />

      <Route path="/admin" element={<Channels_admin/>} />
      <Route path="/admin/channel/:channelInfo" element={<ChannelPage/>} />
      <Route path="/admin/allAccounts" element={<AccountsList_admin/>} />
      <Route path='/admin/find' element={<Find/>} />
      </Routes>
    </Router>
  );
}

export default App;