import { useAuthStore } from "@/store/useStore";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
	const { isAuthenticated } = useAuthStore();
	return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
