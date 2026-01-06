import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Announcement {
  id: number;
  title: string;
  date: string;
  preview: string;
}

interface AnnouncementsProps {
  announcements?: Announcement[];
}

export default function Announcements({
  announcements = [
    {
      id: 1,
      title: 'Holiday Schedule 2025',
      date: 'Dec 20, 2024',
      preview: 'Please review the updated holiday schedule for 2025...',
    },
    {
      id: 2,
      title: 'Annual Performance Review',
      date: 'Dec 18, 2024',
      preview: 'Performance review period starts January 15th...',
    },
    {
      id: 3,
      title: 'New Health Benefits',
      date: 'Dec 15, 2024',
      preview: 'We are excited to announce new health benefits...',
    },
  ],
}: AnnouncementsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Announcements</CardTitle>
        <CardDescription>Latest company updates</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="cursor-pointer rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex items-center justify-between">
                <p className="font-medium">{announcement.title}</p>
                <span className="text-xs text-muted-foreground">
                  {announcement.date}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {announcement.preview}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
