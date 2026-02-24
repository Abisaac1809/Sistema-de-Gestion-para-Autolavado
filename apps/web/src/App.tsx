import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "@/components/AppLayout";

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="mt-1 text-sm text-gray-500">Página en construcción.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
          <Route path="/ordenes" element={<PlaceholderPage title="Gestión de Órdenes" />} />
          <Route path="/ventas" element={<PlaceholderPage title="Ventas" />} />
          <Route path="/compras" element={<PlaceholderPage title="Compras" />} />
          <Route path="/inventario" element={<PlaceholderPage title="Inventario" />} />
          <Route path="/servicios" element={<PlaceholderPage title="Gestión de Servicios" />} />
          <Route path="/configuracion" element={<PlaceholderPage title="Configuración" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
