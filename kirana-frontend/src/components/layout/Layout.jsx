import { Outlet } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import TopBar from './TopBar';
import Header from './Header';
import NavBar from './NavBar';

export default function Layout() {
  const { error } = useEmployee();
  return (
    <>
      <TopBar />
      <Header />
      <NavBar />
      {error && <div className="api-banner"><div className="container">{error}</div></div>}
      <main className="container main"><Outlet /></main>
      <footer className="footer">G-super mart Management System</footer>
    </>
  );
}
