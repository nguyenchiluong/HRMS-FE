import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

interface Task {
  id: number;
  title: string;
  dueDate: string;
}

interface PendingTasksProps {
  tasks?: Task[];
}

export default function PendingTasks({
  tasks = [
    { id: 1, title: 'Complete onboarding checklist', dueDate: 'Dec 25, 2024' },
    { id: 2, title: 'Submit timesheet', dueDate: 'Dec 27, 2024' },
    { id: 3, title: 'Review company policies', dueDate: 'Dec 30, 2024' },
  ],
}: PendingTasksProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Tasks</CardTitle>
        <CardDescription>Tasks that need your attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-muted-foreground">
                    Due: {task.dueDate}
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="sm">
                Complete
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
