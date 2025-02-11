import NftImage from "@/components/custom/nftImage";

export interface NftItemProps {
    name: string;
    description: string;
    tokenId: number;
    src: string;
    alt: string;
    rare: boolean;
}

export default function NftItem(props: NftItemProps) {
    const { name, description, tokenId, src, alt, rare } = props;
    return (
        <div className="flex justify-center pl-1 py-2 mb-1">
            <div
                className={`flex flex-col md:flex-row md:max-w-xl rounded-lg shadow-lg ${
                    rare ? "bg-gold-500" : "bg-white"
                }`}
            >
                <NftImage src={src} alt={alt} />
                <div className="p-6 flex flex-col justify-start">
                    <h5 className="text-gray-900 text-xl font-medium mb-2">{name}</h5>
                    <p className="text-gray-700 text-base mb-4">{description}</p>
                    <p className="text-gray-600 text-xs">所有NFT# {tokenId}</p>
                </div>
            </div>
        </div>
    );
}
