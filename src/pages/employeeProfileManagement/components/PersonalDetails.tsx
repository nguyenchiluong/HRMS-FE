const personalData = [
  { label: "Sex", value: "Male" },
  { label: "Date of Birth", value: "02/07/2003" },
  { label: "Marital Status", value: "Single" },
  { label: "Personal Email Address", value: "kietnguyennumber1@gmail.com" },
  {
    label: "Permanent Address",
    value: "713 An Duong Vuong, Binh Tan District, Ho Chi Minh City",
  },
  {
    label: "Current Address",
    value: "713 An Duong Vuong, Binh Tan District, Ho Chi Minh City",
  },
  { label: "Phone Number (1)", value: "+84 89 949 6257" },
  { label: "Phone Number (2)", value: "(empty)" },
  { label: "Preferred Name", value: "Nguyen Kid (Nguyen Tuan Kiet)" },
];

export default function PersonalDetails() {
  return (
    <div className="flex flex-col px-6 lg:px-[45px] py-6 lg:py-[30px] gap-6 lg:gap-[35px] rounded-2xl lg:rounded-[25px] bg-white">
      <h2 className="text-xl lg:text-[25px] font-semibold text-black">
        Personal Details
      </h2>

      <div className="flex flex-col py-2.5 gap-2.5">
        {personalData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col lg:flex-row py-1.5 px-2.5 gap-2 lg:gap-[45px]"
          >
            <div className="w-full lg:w-[240px] text-black text-base lg:text-[17px] font-medium flex-shrink-0">
              {item.label}
            </div>
            <div className="text-gray-600 text-base lg:text-[17px] font-normal break-words">
              {item.value}
            </div>
          </div>
        ))}
      </div>

      <button className="w-full lg:w-[168px] px-0 py-3 lg:py-[15px] rounded-[25px] bg-sky-200 text-lg lg:text-xl font-medium text-black hover:bg-sky-300 transition-colors">
        EDIT
      </button>
    </div>
  );
}
