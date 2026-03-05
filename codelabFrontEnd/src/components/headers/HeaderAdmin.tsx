import type { HeaderAdmin } from "../../interfaces/Headers/HeaderInterface";

export default function HeaderTitleAdmin(props : Readonly<HeaderAdmin>) {
  return (
    <header>
      <h2 className="text-3xl font-bold text-[#0b4d77] md:text-4xl">
        {props.title}
      </h2>
      <p className="mt-1 text-lg text-[#4661b0] md:text-xl">
        {props.subTitle}
      </p>
    </header>
  );
}
