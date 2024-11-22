import { BrowserRouter, Outlet, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { AuthProvider } from './components/AuthProvider'
import { Button, Container } from 'react-bootstrap'
import { getAuth } from 'firebase/auth';
import Dashboard from './pages/Dashboard';
import { useContext, useEffect } from 'react';
import { AuthContext } from './AuthContext';

function Layout() {
  const auth = getAuth();
  const navigate = useNavigate();
  const { currentUser, setUserInfo, setCurrentUser, userInfo } = useContext(AuthContext);

  useEffect(() => {
    if (!currentUser) {
      navigate("/")
    }
  }, [currentUser, navigate])

  const handleLogout = () => {
    auth.signOut();
    console.log(userInfo);
    setUserInfo([]);
    setCurrentUser(null);
  }
  console.log(userInfo);

  return (
    <>
      <Navbar expand="lg" className="pe-3 bg-body-secondary">
        <Container>
          <Navbar.Brand href="/">Freedom Car Rental Services</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto align-item-end">
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              <Nav.Link href="/profile">Profile</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
        <div className="align-self-baseline">
          <Button
            variant="danger"
            className='me-3'
            onClick={handleLogout}
          >
            Logout
          </Button>
        </div>
      </Navbar>
      <Outlet />
    </>
  )
}

export default function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
