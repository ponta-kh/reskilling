import Link from "next/link";

export default function Page() {
    return (
        <div className="min-h-screen bg-gray-900 text-white py-16 px-4 sm:px-6 lg:px-8">
            <header className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gold-500">Welcome to the VIP Page</h1>
                <p className="mt-4 text-xl text-gold-300">
                    特別なNFTを持つ方だけのサービスを提供します
                </p>
            </header>

            <section className="max-w-4xl mx-auto mb-16">
                <h2 className="text-3xl font-semibold text-gold-500 mb-6">Our Services</h2>
                <ul className="space-y-6 text-lg">
                    <li className="flex items-center space-x-4">
                        <span className="text-gold-300">🎉</span>
                        <span>特別イベントへご招待</span>
                    </li>
                    <li className="flex items-center space-x-4">
                        <span className="text-gold-300">🍸</span>
                        <span>会員制ラウンジ</span>
                    </li>
                    <li className="flex items-center space-x-4">
                        <span className="text-gold-300">🎁</span>
                        <span>限定ギフトプレゼント</span>
                    </li>
                </ul>
            </section>
            <div className="w-96 mx-auto mt-6">
                <Link
                    href="/"
                    className="inline-block px-6 py-3 bg-green-500 text-black rounded-full text-lg w-full text-center"
                >
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
