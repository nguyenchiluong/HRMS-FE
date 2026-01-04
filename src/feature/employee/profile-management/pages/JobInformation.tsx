import JobDetails from '../components/JobInformation/JobDetails';
import WorkingHistory from '../components/JobInformation/WorkingHistory';

export default function JobInformation() {
  return (
    <div className="flex w-full flex-col gap-6">
      <JobDetails />
      <WorkingHistory />
    </div>
  );
}
