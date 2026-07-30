import { FiUsers, FiBox, FiCreditCard, FiAlertCircle } from "react-icons/fi";

export default function Report_count() {
  
  const stats = [
    {
      title: "Active Employees",
      value: "3",
      icon: <FiUsers className="text-blue-600" size={24} />, // আইকন সাইজ ২৪ করা হয়েছে
    },
    {
      title: "Total Assets",
      value: "5",
      icon: <FiBox className="text-purple-600" size={24} />,
    },
    {
      title: "Active Licenses",
      value: "5",
      icon: <FiCreditCard className="text-emerald-600" size={24} />,
    },
    {
      title: "Expiring Soon",
      value: "0",
      icon: <FiAlertCircle className="text-amber-600" size={24} />,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-full">
      {stats.map((item, index) => (
        <div
          key={index}
          className="bg-app-bg border border-app-gray/20 rounded-xl p-6 flex flex-col justify-between min-h-32.5 shadow-2xs"
        >
          <div className="flex justify-between items-center w-full">
            <span className="text-lg font-bold text-text capitalize ">
              {item.title}
            </span>
            <div className="">{item.icon}</div>
          </div>

          <div className="text-4xl  font-bold text-app-text  mt-4">
            {item.value}
          </div>
        </div>
      ))}
    </div>
  );
}
