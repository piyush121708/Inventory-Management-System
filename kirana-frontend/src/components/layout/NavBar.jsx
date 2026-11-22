import { NavLink } from 'react-router-dom';
import { useEmployee } from '../../context/EmployeeContext';
import { NAV_ITEMS } from '../../routes/navItems';

export default function NavBar() {
  const { current, isManager } = useEmployee();
  const items = NAV_ITEMS.filter((i) => isManager || !i.managerOnly);
  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-links">
          {items.map((i) => <NavLink key={i.to} to={i.to}>{i.label}</NavLink>)}
        </div>
        {current && <span className="nav-role">Role: {current.role}</span>}
      </div>
    </nav>
  );
}
