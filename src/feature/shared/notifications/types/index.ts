export interface Notification {
  id: string;
  title: string;
  content: string;
  time: Date;
  isRead: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
  link?: string;
}

