import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

const MOCK_USER = {
  businessName: "Moreno Autoservicio",
};

export function AppLayout() {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar
        businessName={MOCK_USER.businessName}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Topbar onCreateOrder={() => {
          console.log("Crear orden"); // FALTA IMPLEMENTACIÓN
          return;
        }} />

        <main id="main-content" className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
