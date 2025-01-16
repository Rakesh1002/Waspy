import Image from "next/image";
import Link from "next/link";

export function Sidebar() {
  return (
    <div className="flex h-full w-64 flex-col border-r bg-muted/50">
      <div className="flex h-16 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <Image
            src="/logo.svg"
            alt="WASPY"
            width={100}
            height={32}
            className="dark:invert"
          />
        </Link>
      </div>
      {/* Rest of sidebar content... */}
    </div>
  );
} 