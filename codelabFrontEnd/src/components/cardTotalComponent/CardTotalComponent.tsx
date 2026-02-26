import type CardTotalInteface from "../../interfaces/cards/cardTotalInterface";

export default function CardTtoalComponent(props : CardTotalInteface) {

    const numberColor : string = 'mt-1 text-4xl font-bold ' + props.colorNumber;

  return (

      <article className="rounded-2xl bg-[#f3f5f8] p-4 shadow-[0_6px_18px_rgba(0,0,0,0.08)]">
        <h3 className='text-[#4661b0]' >{props.title}</h3>
        <p className={numberColor}>{props.total}</p>
      </article>
  );
}
