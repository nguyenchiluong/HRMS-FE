import { cn } from "@/lib/utils";

interface ChangeRequest {
  fieldChange: string;
  requestDate: string;
  status: "Approved" | "Rejected" | "Pending";
  action?: string;
  notes?: string;
}

const changeRequests: ChangeRequest[] = [
  {
    fieldChange: "Legal Full Name",
    requestDate: "17/09/2025",
    status: "Approved",
  },
  {
    fieldChange: "Social Insurance Number ID",
    requestDate: "17/09/2025",
    status: "Approved",
  },
  {
    fieldChange: "Legal Full Name",
    requestDate: "17/09/2025",
    status: "Rejected",
    action: "Cancel",
    notes: "Lack of legal attached documents",
  },
  {
    fieldChange: "Social Insurance Number ID",
    requestDate: "17/09/2025",
    status: "Approved",
  },
  {
    fieldChange: "Legal Full Name",
    requestDate: "17/09/2025",
    status: "Approved",
  },
  {
    fieldChange: "Social Insurance Number ID",
    requestDate: "17/09/2025",
    status: "Pending",
    action: "Cancel",
  },
];

export default function ChangeRequestsHistory() {
  return (
    <div className="bg-white rounded-[25px] p-6 lg:p-[30px] flex flex-col gap-5">
      <h2 className="text-[18px] font-medium">Change Requests History</h2>

      <div className="overflow-x-auto">
        <div className="min-w-[800px]">
          <div className="flex items-center gap-[45px] bg-hrms-bg-light rounded-t-[5px] px-2.5 py-1.5">
            <div className="w-[250px] text-[15px] font-medium">Field Change</div>
            <div className="w-[135px] text-[15px] font-medium">Request Date</div>
            <div className="w-[110px] text-[15px] font-medium">Status</div>
            <div className="w-[70px] text-[15px] font-medium">Action</div>
            <div className="w-[300px] text-[15px] font-medium">Notes</div>
          </div>

          {changeRequests.map((request, index) => (
            <div
              key={index}
              className={cn(
                "flex items-center gap-[45px] px-2.5 py-1.5",
                index % 2 === 1 ? "bg-hrms-bg-light" : "bg-white"
              )}
            >
              <div className="w-[250px] text-[15px] text-[#65686B]">
                {request.fieldChange}
              </div>
              <div className="w-[135px] text-[15px] text-[#65686B]">
                {request.requestDate}
              </div>
              <div className="w-[110px] text-[15px] text-[#65686B]">
                {request.status}
              </div>
              <div className="w-[70px] text-[15px]">
                {request.action && (
                  <button className="underline hover:text-hrms-primary">
                    {request.action}
                  </button>
                )}
              </div>
              <div className="w-[300px] text-[15px] text-[#65686B]">
                {request.notes}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 mt-2.5">
        <button className="text-hrms-primary text-[15px] font-sora hover:underline">
          Previous
        </button>
        
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 rounded-[10px] bg-white text-hrms-primary text-[17px] font-sora hover:bg-hrms-bg-light">
            1
          </button>
          <button className="text-hrms-primary text-[17px] font-sora hover:underline">
            2
          </button>
          <button className="text-hrms-primary text-[17px] font-sora hover:underline">
            3
          </button>
          <button className="text-hrms-primary text-[17px] font-sora hover:underline">
            4
          </button>
        </div>

        <button className="text-hrms-primary text-[15px] font-sora hover:underline">
          Next
        </button>
      </div>
    </div>
  );
}
