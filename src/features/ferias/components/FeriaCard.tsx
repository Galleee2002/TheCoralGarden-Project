import Image from "next/image";

interface FeriaCardProps {
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
}

const dateFormatter = new Intl.DateTimeFormat("es-AR", { dateStyle: "long" });

export function FeriaCard({ title, description, imageUrl, date }: FeriaCardProps) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-card bg-card-default shadow-sm transition-shadow hover:shadow-md md:h-[320px] md:flex-row">
      <div className="relative h-[220px] w-full shrink-0 overflow-hidden md:h-full md:w-[42%]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 45vw"
        />
      </div>
      <div className="flex flex-col justify-center gap-3 p-6 md:flex-1 md:p-10">
        <p className="font-sans text-xs font-semibold uppercase tracking-wider text-text-secondary">
          {dateFormatter.format(date)}
        </p>
        <h3 className="font-heading text-2xl font-bold leading-tight text-text-primary md:text-3xl">
          {title}
        </h3>
        <p className="line-clamp-4 text-sm text-muted-foreground">{description}</p>
      </div>
    </article>
  );
}
