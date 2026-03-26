interface CatalogoResumenCardProps {
  title: string;
  total: number;
  color: "blue" | "violet" | "amber" | "green";
}

const colorMap = {
  blue: {
    wrapper: "bg-[#eaf1ff]",
    border: "border-[#2f67ff]",
    text: "text-[#2f67ff]",
  },
  violet: {
    wrapper: "bg-[#f4ecff]",
    border: "border-[#9f3dff]",
    text: "text-[#7b21d8]",
  },
  amber: {
    wrapper: "bg-[#fff8e7]",
    border: "border-[#ff9100]",
    text: "text-[#c85b00]",
  },
  green: {
    wrapper: "bg-[#ecfaf2]",
    border: "border-[#0cb455]",
    text: "text-[#008d42]",
  },
};

export default function CatalogoResumenCard({ title, total, color }: CatalogoResumenCardProps) {
  const styles = colorMap[color];

  return (
    <article className={`${styles.wrapper} rounded-[26px] border-l-[6px] ${styles.border} p-6 shadow-[0_8px_18px_rgba(27,60,93,0.08)]`}>
      <p className={`text-2xl font-semibold ${styles.text}`}>{title}</p>
      <p className={`mt-4 text-5xl font-bold ${styles.text}`}>{total}</p>
    </article>
  );
}
