import Image from "next/image";

export default function NftImage({
  src,
  alt,
}: Readonly<{
  src: string;
  alt: string;
}>) {
  return (
    <Image
      src={src}
      alt={alt}
      width={160}
      height={160}
      className="rounded-lg"
    />
  );
}