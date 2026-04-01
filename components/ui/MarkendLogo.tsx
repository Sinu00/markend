import Image from "next/image";

type Props = { dark?: boolean };

export default function MarkendLogo({ dark = true }: Props) {
  return (
    <div className="inline-flex flex-col leading-none">
      <Image
        src={dark ? "/markend-logo-light.png" : "/markend-logo-dark.png"}
        alt="Markend"
        width={160}
        height={52}
        className="h-auto w-[120px] object-contain md:w-[148px]"
        priority
      />
    </div>
  );
}
