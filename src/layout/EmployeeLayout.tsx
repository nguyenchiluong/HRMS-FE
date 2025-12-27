import { Outlet } from "react-router-dom"; // <--- 1. Import cái này

export default function EmployeeLayout() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* 2. Thêm một cái Navbar hoặc Header tạm ở đây cho đẹp */}
      <header className="bg-white border-b p-4 mb-4">
        <h1 className="font-bold text-xl">Employee Portal</h1>
      </header>

      {/* 3. QUAN TRỌNG NHẤT: Thêm Outlet vào đây */}
      <main className="container mx-auto p-4">
        <Outlet /> 
      </main>
    </div>
  );
}