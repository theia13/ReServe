export default function StatCard({
  icon,
  title,
  value,
  className,
  iconClassName,
}) {
  return (
    <div
      className={`bg-white rounded-lg p-5 shadow-sm transition-all hover:shadow-md hover:shadow-gray-200 animate-fade-in ${className} `}
    >
      <div
        className={`flex md:flex-col lg:flex-row lg:items-center gap-2 mb-3 ${iconClassName}`}
      >
        {icon}
        <span className="text-[#6b7280] text-md">{title}</span>
      </div>
      <p className="text-[1.8rem] text-[#020817] font-semibold">{value}</p>
    </div>
  );
}
