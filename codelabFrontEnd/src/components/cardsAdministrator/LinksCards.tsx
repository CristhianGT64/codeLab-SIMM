import { Link } from "react-router";
import type { DashboardInterface } from "../../interfaces/DashboardInterface";
export default function LinkCard(data : Readonly<DashboardInterface>) {
  return (
    <Link
      to={data.url}
      className = {`rounded-2xl bg-white p-6 shadow-[0_6px_18px_rgba(10,64,89,0.08)] border-l-4 ${data.colorBorder} hover:shadow-[0_12px_28px_rgba(10,64,89,0.16)] hover:scale-[1.02] transition-all duration-200 cursor-pointer block min-h-[200px] flex flex-col`}
    >
      <div className="flex flex-col h-full">
        <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${data.colorSvg} flex items-center justify-center mb-4`}>
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d={data.svg}
            />
          </svg>
        </div>
        <h3 className="text-[#4661b0] text-sm font-medium uppercase tracking-wide">
          {data.title}
        </h3>
        <p className="mt-2 text-lg font-bold text-[#24364d] flex-grow">
          {data.description}
        </p>
        <span className="text-sm text-[#6b7a8f] mt-3">{data.buttonDescription}</span>
      </div>
    </Link>
  );
}
