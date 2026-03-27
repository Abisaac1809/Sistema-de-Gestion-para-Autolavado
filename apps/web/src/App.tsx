import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { GlobalErrorBoundary } from "@/components/GlobalErrorBoundary";
import { SettingsPage } from "@/pages/SettingsPage";
import { InventoryPage } from "@/pages/InventoryPage";
import { ServicesPage } from "@/pages/ServicesPage";
import PurchasesPage from "@/pages/PurchasesPage";
import SalesPage from "@/pages/SalesPage";
import OrdersPage from "@/pages/OrdersPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 2,
			retry: 3
		}
	},
});

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
		<GlobalErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route element={<AppLayout />}>
							<Route index element={<Navigate to="/dashboard" replace />} />
							<Route path="/dashboard" element={<PlaceholderPage title="Dashboard" />} />
							<Route path="/ordenes" element={<OrdersPage />} />
							<Route path="/ventas" element={<SalesPage />} />
							<Route path="/compras" element={<PurchasesPage />} />
							<Route path="/inventario" element={<InventoryPage />} />
							<Route path="/servicios" element={<ServicesPage />} />
							<Route path="/configuracion" element={<SettingsPage />} />
							<Route path="/*" element={<Navigate to="/dashboard" replace />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</QueryClientProvider>
		</GlobalErrorBoundary>
	);
}
