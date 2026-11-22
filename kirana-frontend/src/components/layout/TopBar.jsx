import { useEmployee } from '../../context/EmployeeContext';

export default function TopBar() {
  const { active, current, select } = useEmployee();
  return (
    <div className="topbar">
      <div className="container row between">
        <span>Welcome to G-super mart management</span>
        <label className="working-as">
          Working as
          <select value={current?.id ?? ''} onChange={(e) => select(Number(e.target.value))}>
            {active.map((e) => <option key={e.id} value={e.id}>{e.name} ({e.role})</option>)}
          </select>
        </label>
      </div>
    </div>
  );
}
