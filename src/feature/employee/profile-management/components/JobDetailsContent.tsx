interface InfoRow {
  label: string;
  value: string;
}

const jobDetailsData: InfoRow[] = [
  { label: "Employ ID", value: "P010023" },
  { label: "Work Email", value: "kiet.nguyen@meetup.com.us" },
  { label: "Position", value: "Software Engineer" },
  { label: "Job Level", value: "Junior" },
  { label: "Department", value: "IT Banking Department" },
  { label: "Employee Type", value: "Fixed Term" },
  { label: "Time Type", value: "Full-time" },
];

const contactInfo: InfoRow[] = [
  { label: "Work Email", value: "kiet.nguyen@meetup.com.us" },
];

const serviceDates: InfoRow[] = [
  { label: "Original Hiring Date", value: "20/11/2024" },
  { label: "Continuous Service Date", value: "20/11/2025" },
  { label: "Length of Services", value: "1 year(s), 3 month(s), 12 day(s)" },
];

function InfoRowComponent({ label, value }: InfoRow) {
  return (
    <div className="flex items-start gap-[45px] py-[5px]">
      <div className="w-[180px] md:w-[240px] text-black font-medium text-[17px]">
        {label}
      </div>
      <div className="flex-1 text-hrms-text-secondary font-normal text-[17px]">
        {value}
      </div>
    </div>
  );
}

export default function JobDetailsContent() {
  return (
    <div className="flex flex-col gap-[30px] w-full">
      {/* Job Details and Contact Information Row */}
      <div className="flex flex-col lg:flex-row gap-[35px] p-[30px] md:px-[45px] md:py-[30px] rounded-[25px] bg-white">
        {/* Job Details Section */}
        <div className="flex flex-col gap-5 flex-1">
          <h2 className="text-black text-[25px] font-semibold">Job Details</h2>
          <div className="flex flex-col gap-2.5 py-2.5">
            {jobDetailsData.map((item) => (
              <InfoRowComponent key={item.label} {...item} />
            ))}
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="flex flex-col gap-5 flex-1 lg:max-w-[400px]">
          <h2 className="text-black text-[25px] font-semibold">Contact Information</h2>
          <div className="flex flex-col gap-2.5 py-2.5">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-start gap-[45px] py-[5px]">
                <div className="w-[102px] text-black font-medium text-[17px]">
                  {item.label}
                </div>
                <div className="flex-1 text-hrms-text-secondary font-normal text-[17px]">
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Dates Section */}
      <div className="flex flex-col gap-5 p-[30px] md:px-[45px] md:py-[30px] rounded-[25px] bg-white">
        <h2 className="text-black text-[25px] font-semibold">Service Dates</h2>
        <div className="flex flex-col gap-2.5 py-2.5">
          {serviceDates.map((item) => (
            <div key={item.label} className="flex items-start gap-[45px] py-[5px] px-2.5">
              <div className="w-[240px] text-black font-medium text-[17px]">
                {item.label}
              </div>
              <div className="flex-1 text-hrms-text-secondary font-normal text-[17px]">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}