interface WorkHistoryEntry {
  position: string;
  level: string;
  department: string;
  timePeriod: string;
}

const workHistory: WorkHistoryEntry[] = [
  {
    position: "Software Engineer",
    level: "Junior",
    department: "IT Banking Department",
    timePeriod: "16/05/2025 - now",
  },
  {
    position: "Software Engineer",
    level: "Fresher",
    department: "IT Banking Department",
    timePeriod: "20/11/2024 - 15/05/2025",
  },
  {
    position: "Software Engineer",
    level: "Internship",
    department: "Tech Fresher Program",
    timePeriod: "05/05/2024 - 19/11/2025",
  },
  {
    position: "Software Engineer",
    level: "Apprenticeship",
    department: "Early Career Program",
    timePeriod: "20/11/2023 - 04/04/2025",
  },
];

export default function WorkingHistoryContent() {
  return (
    <div className="flex flex-col gap-5 p-[30px] md:px-[45px] md:py-[30px] rounded-[25px] bg-white w-full">
      <h2 className="text-black text-[25px] font-semibold">Working History</h2>

      {/* Table Container */}
      <div className="w-full overflow-x-auto pb-[30px]">
        <div className="min-w-[600px] flex flex-col">
          {/* Table Header */}
          <div className="flex items-center gap-[45px] py-[5px] px-2.5 rounded-t-[5px] bg-hrms-bg-light">
            <div className="w-[250px] text-black font-medium text-[15px] leading-normal">
              Position
            </div>
            <div className="w-[120px] text-black font-medium text-[15px] leading-normal">
              Level
            </div>
            <div className="w-[260px] text-black font-medium text-[15px] leading-normal">
              Department
            </div>
            <div className="flex-1 text-black font-medium text-[15px] leading-normal">
              Time Period
            </div>
          </div>

          {/* Table Rows */}
          {workHistory.map((entry, index) => (
            <div
              key={index}
              className={`flex items-center gap-[45px] py-[5px] px-2.5 ${
                index % 2 === 0 ? "bg-hrms-bg-light" : "bg-white"
              } ${index === workHistory.length - 1 ? "rounded-b-[5px]" : ""}`}
            >
              <div className="w-[250px] text-[#65686B] font-normal text-[15px]">
                {entry.position}
              </div>
              <div className="w-[120px] text-[#65686B] font-normal text-[15px]">
                {entry.level}
              </div>
              <div className="w-[260px] text-hrms-text-secondary font-normal text-[15px]">
                {entry.department}
              </div>
              <div className="flex-1 text-hrms-text-secondary font-normal text-[15px]">
                {entry.timePeriod}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
