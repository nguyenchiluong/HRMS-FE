import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react';
import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useHrPersonnel } from '../hooks/useHrPersonnel';
import { useManagers } from '../hooks/useManagers';
import { useReassignSupervisors } from '../hooks/useReassignSupervisors';
import type { Employee } from '../types';

interface ReassignSupervisorsModalProps {
  employee: Employee;
  onClose: () => void;
}

const reassignSupervisorsSchema = Yup.object().shape({
  managerId: Yup.number().nullable(),
  hrId: Yup.number().nullable(),
});

interface ReassignSupervisorsFormData {
  managerId: number | '';
  hrId: number | '';
}

export default function ReassignSupervisorsModal({
  employee,
  onClose,
}: ReassignSupervisorsModalProps) {
  const [managerOpen, setManagerOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [managerSearch, setManagerSearch] = useState('');
  const [hrSearch, setHrSearch] = useState('');

  const reassignMutation = useReassignSupervisors({
    onSuccess: onClose,
  });

  const formik = useFormik<ReassignSupervisorsFormData>({
    initialValues: {
      managerId: employee.managerId ?? '',
      hrId: employee.hrId ?? '',
    },
    validationSchema: reassignSupervisorsSchema,
    onSubmit: (values) => {
      reassignMutation.mutate({
        employeeId: Number(employee.id),
        data: {
          managerId: values.managerId ? Number(values.managerId) : null,
          hrId: values.hrId ? Number(values.hrId) : null,
        },
      });
    },
  });

  // Fetch managers with search - fetch when popover opens
  const {
    data: managersData = [],
    isLoading: managersLoading,
  } = useManagers({
    search: managerSearch || undefined,
    enabled: managerOpen, // Only fetch when popover is open
  });

  // Fetch HR personnel with search - fetch when popover opens
  const {
    data: hrData = [],
    isLoading: hrLoading,
  } = useHrPersonnel({
    search: hrSearch || undefined,
    enabled: hrOpen, // Only fetch when popover is open
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-50 mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border bg-white p-6 shadow-lg">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between border-b pb-4">
          <div>
            <h3 className="text-xl font-semibold">Reassign Supervisors</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {employee.fullName} ({employee.workEmail})
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Manager */}
          <div className="space-y-2">
            <Label htmlFor="managerId">Manager</Label>
            <Popover
              open={managerOpen}
              onOpenChange={(open) => {
                setManagerOpen(open);
                if (!open) {
                  setManagerSearch('');
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={managerOpen}
                  className="w-full justify-between"
                  type="button"
                  onBlur={() => formik.setFieldTouched('managerId', true)}
                >
                  <span className="truncate">
                    {formik.values.managerId
                      ? managersData.find(
                          (emp) =>
                            Number(emp.id) === Number(formik.values.managerId),
                        )?.fullName || employee.managerName || 'Select manager...'
                      : 'Select manager...'}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search manager..."
                    value={managerSearch}
                    onValueChange={setManagerSearch}
                  />
                  <CommandList>
                    {managersLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No manager found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              formik.setFieldValue('managerId', '');
                              setManagerOpen(false);
                              setManagerSearch('');
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                !formik.values.managerId
                                  ? 'opacity-100'
                                  : 'opacity-0',
                              )}
                            />
                            None (No Manager)
                          </CommandItem>
                          {managersData.map((manager) => (
                            <CommandItem
                              key={manager.id}
                              value={manager.fullName}
                              onSelect={() => {
                                formik.setFieldValue(
                                  'managerId',
                                  Number(manager.id),
                                );
                                setManagerOpen(false);
                                setManagerSearch('');
                              }}
                            >
                              <Check
                                className={cn(
                                  'mr-2 h-4 w-4',
                                  Number(formik.values.managerId) ===
                                    Number(manager.id)
                                    ? 'opacity-100'
                                    : 'opacity-0',
                                )}
                              />
                              {manager.fullName}
                              {manager.position && (
                                <span className="ml-2 text-xs text-muted-foreground">
                                  ({manager.position})
                                </span>
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formik.touched.managerId && formik.errors.managerId && (
              <p className="text-sm text-red-500">
                {formik.errors.managerId}
              </p>
            )}
          </div>

          {/* HR */}
          <div className="space-y-2">
            <Label htmlFor="hrId">HR (Admin)</Label>
            <Popover
              open={hrOpen}
              onOpenChange={(open) => {
                setHrOpen(open);
                if (!open) {
                  setHrSearch('');
                }
              }}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={hrOpen}
                  className="w-full justify-between"
                  type="button"
                  onBlur={() => formik.setFieldTouched('hrId', true)}
                >
                  <span className="truncate">
                    {formik.values.hrId
                      ? hrData.find(
                          (hr) => Number(hr.id) === Number(formik.values.hrId),
                        )?.fullName || employee.hrName || 'Select HR...'
                      : 'Select HR...'}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[var(--radix-popover-trigger-width)] p-0"
                align="start"
              >
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder="Search HR..."
                    value={hrSearch}
                    onValueChange={setHrSearch}
                  />
                  <CommandList>
                    {hrLoading ? (
                      <div className="flex items-center justify-center py-6">
                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>No HR found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value="none"
                            onSelect={() => {
                              formik.setFieldValue('hrId', '');
                              setHrOpen(false);
                              setHrSearch('');
                            }}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                !formik.values.hrId ? 'opacity-100' : 'opacity-0',
                              )}
                            />
                            None (No HR)
                          </CommandItem>
                          {hrData.map((hr) => (
                              <CommandItem
                                key={hr.id}
                                value={hr.fullName}
                                onSelect={() => {
                                  formik.setFieldValue('hrId', Number(hr.id));
                                  setHrOpen(false);
                                  setHrSearch('');
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    Number(formik.values.hrId) === Number(hr.id)
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                {hr.fullName}
                                {hr.position && (
                                  <span className="ml-2 text-xs text-muted-foreground">
                                    ({hr.position})
                                  </span>
                                )}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {formik.touched.hrId && formik.errors.hrId && (
              <p className="text-sm text-red-500">{formik.errors.hrId}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={!formik.dirty || reassignMutation.isPending}
            >
              {reassignMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

