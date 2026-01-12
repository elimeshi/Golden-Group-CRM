import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout  from './Layout.jsx'
import Clients from './Pages/Clients.jsx'
import Dashboard from './Pages/Dashboard.jsx';
import Leads from './Pages/Leads.jsx';
import Listings from './Pages/Listing.jsx';
export default function App() { 
    return <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/Clients" element={<Clients/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/Leads" element={<Leads/>}/>
          <Route path="/Listings" element={<Listings/>}/>
        </Routes>
      </Layout>
    </BrowserRouter>; 
}