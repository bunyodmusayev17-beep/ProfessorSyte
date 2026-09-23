import { NavLink, Outlet } from "react-router-dom";
import Layout from "../../components/Layout";

const tabs = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/videos", label: "Videos" },
  { to: "/admin/projects", label: "Projects" },
  { to: "/admin/users", label: "Users" },
];

export default function AdminLayout() {
  return (
    <Layout>
      <h1 className="text-xl font-semibold text-ink mb-4">Admin panel</h1>
      <div className="flex gap-2 border-b border-border mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.end}
            className={({ isActive }) =>
              `text-sm font-medium px-3 py-2 border-b-2 -mb-px whitespace-nowrap ${
                isActive ? "border-primary text-primary" : "border-transparent text-muted"
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <Outlet />
    </Layout>
  );
}
