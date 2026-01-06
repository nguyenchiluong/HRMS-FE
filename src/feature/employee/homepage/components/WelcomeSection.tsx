import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface WelcomeSectionProps {
  userName?: string;
}

export default function WelcomeSection({ userName }: WelcomeSectionProps) {

  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <h1 className="text-2xl font-semibold">
          Welcome back, {userName || 'Employee'}! 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here's what's happening with your account today.
        </p>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => navigate('/employee/time/attendance')}>
          <Clock className="mr-2 h-4 w-4" />
          Clock In
        </Button>
        {/* <Button size="sm">
          <TrendingUp className="mr-2 h-4 w-4" />
          View Payslip
        </Button> */}
      </div>
    </div>
  );
}
