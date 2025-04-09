import darkLogo from "@/assets/logos/dark.svg";
import logo from "@/../public/images/logo/logo-inbtp.png";
import Image from "next/image";

export function Logo() {
  return (
    <div className="relative h-30 max-w-[10.847rem]">
      <Image
        src={logo}
        fill
        // className="dark:hidden"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      />

      {/* <Image
        src={darkLogo}
        fill
        className="hidden dark:block"
        alt="NextAdmin logo"
        role="presentation"
        quality={100}
      /> */}
    </div>
  );
}
