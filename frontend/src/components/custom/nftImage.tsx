import Image from "next/image";

export interface NftImageProps {
    src: string;
    alt: string;
}

export default function NftImage(props: NftImageProps) {
    const { src, alt } = props;
    return (
        <Image src={src} alt={alt} width={160} height={160} className="rounded-lg m-auto pt-5" />
    );
}
