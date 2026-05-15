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
import DashboardPage from "@/pages/DashboardPage";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 2,
			retry: 3
		}
	},
});


export default function App() {
	return (
		<GlobalErrorBoundary>
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<Routes>
						<Route element={<AppLayout />}>
							<Route index element={<Navigate to="/dashboard" replace />} />
							<Route path="/dashboard" element={<DashboardPage />} />
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
