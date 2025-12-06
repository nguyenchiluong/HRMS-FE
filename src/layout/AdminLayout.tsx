import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { Home, LogOut, Trophy, Users } from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';

export default function AdminLayout() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <h1 className="text-2xl font-bold text-primary">HRMS</h1>
              <div className="flex space-x-4">
                <Link to="/">
                  <Button variant="ghost" size="sm">
                    <Home className="mr-2 h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
                <Link to="/employees">
                  <Button variant="ghost" size="sm">
                    <Users className="mr-2 h-4 w-4" />
                    Employees
                  </Button>
                </Link>
                <Link to="/admin/campaigns">
                  <Button variant="ghost" size="sm">
                    <Trophy className="mr-2 h-4 w-4" />
                    Campaigns
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="text-sm">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-muted-foreground">{user.role}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
