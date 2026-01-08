import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useEffect, useState } from 'react';
import { useBlocker } from 'react-router-dom';

interface UnsavedChangesWarningProps {
  /**
   * Whether the form has unsaved changes (typically Formik's `dirty` prop)
   */
  hasUnsavedChanges: boolean;
  /**
   * Optional custom message to display in the warning dialog
   */
  message?: string;
  /**
   * Optional custom title for the warning dialog
   */
  title?: string;
}

/**
 * A reusable component that warns users about unsaved changes when navigating away.
 * Works with React Router navigation and browser navigation (refresh, close tab).
 *
 * @example
 * ```tsx
 * <Formik>
 *   {({ dirty }) => (
 *     <>
 *       <UnsavedChangesWarning hasUnsavedChanges={dirty} />
 *       <Form>...</Form>
 *     </>
 *   )}
 * </Formik>
 * ```
 */
export default function UnsavedChangesWarning({
  hasUnsavedChanges,
  message = 'You have unsaved changes. Are you sure you want to leave? Your changes will be lost.',
  title = 'Unsaved Changes',
}: UnsavedChangesWarningProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);

  // Block React Router navigation when there are unsaved changes
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname,
  );

  // Show dialog when navigation is blocked
  useEffect(() => {
    if (blocker.state === 'blocked') {
      setShowDialog(true);
      setPendingNavigation(() => blocker.proceed);
    }
  }, [blocker]);

  // Handle browser navigation (refresh, close tab, etc.)
  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      // Modern browsers ignore custom messages, but we still need to call preventDefault
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleConfirm = () => {
    setShowDialog(false);
    if (pendingNavigation) {
      pendingNavigation();
      setPendingNavigation(null);
    }
  };

  const handleCancel = () => {
    setShowDialog(false);
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
    setPendingNavigation(null);
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>Stay on Page</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm}>Leave Page</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

