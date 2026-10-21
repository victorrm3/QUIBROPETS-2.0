type PageHeroProps = {
  title: string;
  description?: string;
};

export function PageHero({ title, description }: PageHeroProps) {
  return (
    <section className="border-b border-zinc-200 bg-zinc-50 px-6 py-16 lg:px-10 lg:py-20">
      <div className="mx-auto max-w-5xl">
        <h1 className="font-montserrat text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-2xl text-base text-zinc-600 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
