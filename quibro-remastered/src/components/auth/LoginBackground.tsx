import Image from "next/image";

export function LoginBackground() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Image
        src="/images/loginbackground.webp"
        alt=""
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/70" />
    </div>
  );
}
