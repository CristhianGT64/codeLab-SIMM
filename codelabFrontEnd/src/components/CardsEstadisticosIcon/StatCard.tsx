import type { IstatCard } from "../../interfaces/Inventario/IstatsCard";

type IconType = "box" | "up" | "down";

export default function StatCard(stats : Readonly<IstatCard>) {
    const icons: Record<IconType, React.ReactNode> = {
        box: (
            <svg className="w-5 h-5 text-[#4661b0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0v10l-8 4m-8-4V7m8 10V7" />
            </svg>
        ),
        up: (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
        ),
        down: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M13 17H5m0 0V9m0 8l8-8 4 4 6-6" />
            </svg>
        ),
    };

    return (
        <div className="bg-white rounded-xl p-4 shadow-[0_4px_12px_rgba(10,64,89,0.08)] flex flex-col gap-2">
            <div className="flex items-center justify-between">
                <span className="text-xs text-[#6b7a8f] font-medium">{stats.label}</span>
                {icons[stats.icon]}
            </div>
            <p className={`text-2xl font-bold ${stats.valueColor}`}>{stats.value}</p>
        </div>
    );
}