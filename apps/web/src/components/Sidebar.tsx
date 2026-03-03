import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  ShoppingBag,
  Package,
  BarChart2,
  Settings,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { useStoreInfo } from "@/features/settings/hooks/useStoreInfo";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Ordenes", href: "/ordenes", icon: ClipboardList },
  { label: "Ventas", href: "/ventas", icon: TrendingUp },
  { label: "Compras", href: "/compras", icon: ShoppingBag },
  { label: "Inventario", href: "/inventario", icon: Package },
  { label: "Servicios", href: "/servicios", icon: BarChart2 },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: "Configuracion", href: "/configuracion", icon: Settings },
];

export function Sidebar() {
  const storeInfo = useStoreInfo();
  const businessName = storeInfo.storeInfo?.name || "Mi Autolavado";
  return (
    <aside
      aria-label="Navegación principal"
      className="flex h-screen w-60 shrink-0 flex-col border-r border-gray-200 bg-white"
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-center border-b border-gray-200 px-4">
        <span className="text-lg font-bold tracking-tight text-gray-900">
          AUTOLAVADO
        </span>
      </div>

      {/* Nav principal */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul role="list" className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </ul>
      </nav>

      {/* Sección inferior */}
      <div className="border-t border-gray-200 px-3 py-3">
        <ul role="list" className="mb-3 space-y-1">
          {BOTTOM_ITEMS.map((item) => (
            <SidebarNavItem key={item.href} item={item} />
          ))}
        </ul>

        {/* Nombre del carwash */}
        <div className="flex px-2 py-2">
          <span className="text-left text-sm font-medium text-gray-700">
            {businessName} 
          </span>
        </div>
      </div>
    </aside>
  );
}

function SidebarNavItem({ item }: { item: NavItem }) {
  const Icon = item.icon;

  return (
    <li>
      <NavLink
        to={item.href}
        className={({ isActive }) =>
          cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 focus-visible:ring-offset-1",
            isActive
              ? "bg-gray-900 text-white"

              : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          )
        }
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span>{item.label}</span>
      </NavLink>
    </li>
  );
}
