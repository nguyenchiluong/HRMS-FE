import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotepadTextDashed } from 'lucide-react';
import { Header } from '../components/Header';
import { JobDetailsSection } from '../components/JobDetailsSection';
import { OnboardingForm } from '../components/OnboardingForm';
import { EmployeeOnboardingStore } from '../store';

const queryClient = new QueryClient();

export default function EmployeeOnboarding() {
  const { currentUser } = EmployeeOnboardingStore();
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <Header />

        <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          {/* Intro Section */}
          <div className="mb-10 flex flex-col items-start justify-between md:flex-row">
            <div className="max-w-3xl">
              <h2 className="mb-4 text-xl font-semibold uppercase tracking-wide text-red-600">
                New Employee Onboarding
              </h2>
              <p className="text-gray-150 text-md leading-relaxed">
                Hello {currentUser.name}! We are excited for your first day.
                <br />
                Please help us prepare for your arrival by reviewing and
                addressing the questions below.
              </p>
            </div>

            {/* User Icon Circle */}
            <div className="relative mt-4 hidden md:mt-0 md:flex">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-secondary/50 bg-secondary shadow-sm">
                <NotepadTextDashed className="h-8 w-8 text-primary" />
              </div>
            </div>
          </div>

          <JobDetailsSection />

          <div className="my-8 border-t border-gray-100"></div>

          <OnboardingForm />
        </main>
      </div>
    </QueryClientProvider>
  );
}
