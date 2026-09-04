import { Link, NavLink } from "react-router-dom";

const links = [
  { to: "/waste-reports", label: "Waste Reports" },
  { to: "/collection-schedules", label: "Collection Schedules" },
  { to: "/waste-locations", label: "Waste Locations" },
  { to: "/community-requests", label: "Community Requests" },
];

export default function Navbar() {
  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-sm font-bold text-white">
            C
          </span>
          <span className="text-lg font-semibold text-gray-800">
            Clean<span className="text-green-600">LK</span>
          </span>
        </Link>

        <div className="hidden gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-green-50 text-green-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Simple mobile nav row (no hamburger needed for a small hackathon demo) */}
      <div className="flex gap-1 overflow-x-auto border-t border-gray-100 px-4 py-2 md:hidden">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium ${
                isActive
                  ? "bg-green-50 text-green-700"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
