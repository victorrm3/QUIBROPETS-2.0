type HeroProps = {
  videoSrc?: string;
  title?: string;
  subtitle?: string;
};

export function Hero({
  videoSrc = "/videos/hero.mp4",
  title = "QUIBROPETS",
  subtitle = "Dale a tu mascota lo que necesita",
}: HeroProps) {
  return (
    <section className="relative flex min-h-[85vh] w-full items-start justify-center overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      >
        <source src={videoSrc} type="video/mp4" />
      </video>

      <div className="absolute inset-0 bg-black/50" aria-hidden="true" />

      <div className="relative z-10 w-full px-6 pt-8 text-center sm:pt-10 md:pt-12 lg:px-10 xl:px-12 2xl:px-16">
        <h1 className="font-montserrat text-5xl font-bold leading-none tracking-tight text-white sm:text-6xl md:text-7xl lg:text-[7.5rem] lg:tracking-[0.1em] xl:text-[9.5rem] xl:tracking-[0.14em] 2xl:text-[11.5rem] 2xl:tracking-[0.16em]">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-4 text-lg text-zinc-200 sm:text-xl md:mt-6">{subtitle}</p>
        ) : null}
      </div>
    </section>
  );
}
