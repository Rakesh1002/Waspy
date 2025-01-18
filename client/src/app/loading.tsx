import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-pulse">
        <Image
          src="/logo.svg"
          alt="WASPY"
          width={160}
          height={53}
          className="dark:invert"
        />
      </div>
    </div>
  );
}
