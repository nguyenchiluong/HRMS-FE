import { CheckCircle2, Loader2 } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../components/Header';
import { JobDetailsSection } from '../components/JobDetailsSection';
import { OnboardingForm } from '../components/OnboardingForm';
import { useOnboardingInfo } from '../hooks/useOnboarding';

// Check if status indicates onboarding is still pending
const isPendingOnboarding = (status: string | null | undefined): boolean => {
  if (!status) return true; // Assume pending if no status
  const normalized = status.toUpperCase().replace(/_/g, '');
  return normalized === 'PENDINGONBOARDING';
};

export default function EmployeeOnboarding() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { data: onboardingInfo, isLoading, isError, error } = useOnboardingInfo(
    token ?? undefined,
  );

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">Invalid Link</h2>
          <p className="mt-2 text-slate-500">
            This onboarding link is invalid. Please check your email for the
            correct link.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#253D90]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600">
            Link Expired or Invalid
          </h2>
          <p className="mt-2 text-slate-500">
            {(error as Error)?.message ||
              'This onboarding link has expired or is invalid. Please contact HR for assistance.'}
          </p>
        </div>
      </div>
    );
  }

  if (!onboardingInfo) {
    return null;
  }

  // Check if onboarding is already completed
  if (!isPendingOnboarding(onboardingInfo.status)) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="mx-4 max-w-md text-center">
          <div className="mb-6 flex justify-center">
            <div className="rounded-full bg-green-100 p-4">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>

          <h1 className="mb-4 text-3xl font-bold text-slate-900">
            Onboarding Already Completed
          </h1>

          <p className="mb-6 text-lg text-slate-600">
            Hi <span className="font-semibold">{onboardingInfo.fullName}</span>,
            your onboarding has already been completed. If you need to update
            your information, please contact HR.
          </p>

          <p className="text-sm text-slate-500">
            You can safely close this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-slate-900">
            Welcome, {onboardingInfo.fullName}!
          </h2>
          <p className="mt-1 text-slate-500">
            Complete your onboarding by filling out the information below.
          </p>
        </div>

        {/* Job Details Card */}
        <JobDetailsSection onboardingInfo={onboardingInfo} />

        {/* Divider */}
        <div className="my-8 border-t border-slate-200" />

        {/* Form */}
        <OnboardingForm
          employeeId={onboardingInfo.id}
          token={token}
          initialData={onboardingInfo}
        />
      </main>
    </div>
  );
}
