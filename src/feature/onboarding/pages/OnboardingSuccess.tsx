import { CheckCircle2, Loader2 } from 'lucide-react';
import { Navigate, useSearchParams } from 'react-router-dom';
import { useOnboardingInfo } from '../hooks/useOnboarding';

export default function OnboardingSuccess() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const { data: onboardingInfo, isLoading, isError } = useOnboardingInfo(
    token ?? undefined,
  );

  // No token - redirect to 404
  if (!token) {
    return <Navigate to="/404" replace />;
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <Loader2 className="h-8 w-8 animate-spin text-[#253D90]" />
      </div>
    );
  }

  // Invalid token - redirect to 404
  if (isError || !onboardingInfo) {
    return <Navigate to="/404" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="mx-4 max-w-md text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-green-100 p-4">
            <CheckCircle2 className="h-16 w-16 text-green-600" />
          </div>
        </div>

        <h1 className="mb-4 text-3xl font-bold text-slate-900">
          Onboarding Complete!
        </h1>

        <p className="mb-6 text-lg text-slate-600">
          Thank you, <span className="font-semibold">{onboardingInfo.fullName}</span>! 
          Your information has been submitted successfully. Our HR team will review
          your details and reach out if anything else is needed.
        </p>

        <div className="rounded-xl border border-slate-200 bg-white p-6 text-left">
          <h2 className="mb-3 font-semibold text-slate-900">What's Next?</h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#253D90]" />
              Your information will be reviewed by HR
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#253D90]" />
              You'll receive your login credentials via email
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#253D90]" />
              Prepare for your first day
              {onboardingInfo.startDate && (
                <span className="font-medium"> on {onboardingInfo.startDate}</span>
              )}
            </li>
          </ul>
        </div>

        <p className="mt-6 text-sm text-slate-500">
          You can safely close this page now.
        </p>
      </div>
    </div>
  );
}

