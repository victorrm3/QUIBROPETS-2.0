import Link from "next/link";

type StoreNavProps = {
  backHref: string;
  backLabel: string;
  title?: string;
  subtitle?: string;
};

export function StoreNav({
  backHref,
  backLabel,
  title,
  subtitle,
}: StoreNavProps) {
  return (
    <section className="border-b border-zinc-800 px-6 py-6 lg:px-10">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 rounded-full border border-zinc-600 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:border-white hover:bg-zinc-800"
      >
        <span aria-hidden="true" className="text-base leading-none">
          ←
        </span>
        {backLabel}
      </Link>
      {title ? (
        <h1 className="mt-5 font-montserrat text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
      ) : null}
      {subtitle ? <p className="mt-2 text-sm text-zinc-400">{subtitle}</p> : null}
    </section>
  );
}
