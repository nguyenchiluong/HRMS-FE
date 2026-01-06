import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WorkHistoryEntry {
  position: string;
  level: string;
  department: string;
  timePeriod: string;
}

// Mock data - replace with API call when available
const workHistory: WorkHistoryEntry[] = [
  {
    position: 'Software Engineer',
    level: 'Junior',
    department: 'IT Banking Department',
    timePeriod: '16/05/2025 - now',
  },
  {
    position: 'Software Engineer',
    level: 'Fresher',
    department: 'IT Banking Department',
    timePeriod: '20/11/2024 - 15/05/2025',
  },
  {
    position: 'Software Engineer',
    level: 'Internship',
    department: 'Tech Fresher Program',
    timePeriod: '05/05/2024 - 19/11/2025',
  },
  {
    position: 'Software Engineer',
    level: 'Apprenticeship',
    department: 'Early Career Program',
    timePeriod: '20/11/2023 - 04/04/2025',
  },
];

export default function WorkingHistory() {
  return (
    <Card className="flex w-full flex-col p-6">
      <div className="mb-6">
        <h2 className="text-xl font-medium text-gray-900">Working History</h2>
      </div>

      <div className="space-y-4">
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Table Header */}
            <div className="flex items-center gap-8 rounded-t-lg border-b border-gray-200 bg-gray-50 px-4 py-3">
              <div className="w-[250px] text-sm font-medium text-gray-900">
                Position
              </div>
              <div className="w-[120px] text-sm font-medium text-gray-900">
                Level
              </div>
              <div className="w-[260px] text-sm font-medium text-gray-900">
                Department
              </div>
              <div className="flex-1 text-sm font-medium text-gray-900">
                Time Period
              </div>
            </div>

            {/* Table Rows */}
            {workHistory.map((entry, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-center gap-8 border-b border-gray-100 px-4 py-3 last:border-0',
                  index % 2 === 1 ? 'bg-gray-50' : 'bg-white',
                )}
              >
                <div className="w-[250px] text-sm text-gray-700">
                  {entry.position}
                </div>
                <div className="w-[120px] text-sm text-gray-700">
                  {entry.level}
                </div>
                <div className="w-[260px] text-sm text-gray-700">
                  {entry.department}
                </div>
                <div className="flex-1 text-sm text-gray-700">
                  {entry.timePeriod}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
