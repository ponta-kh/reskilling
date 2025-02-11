import { Card, CardHeader, CardTitle, CardContent } from "@/components/shadcn/card";

export interface ProfileCardProps {
    address: string;
    tokenBalance: string;
    bankBalance: string;
}

export default function ProfileCard(props: ProfileCardProps) {
    const { address, tokenBalance, bankBalance } = props;
    return (
        <Card className="w-500 m-auto">
            <CardHeader>
                <CardTitle>アカウント情報</CardTitle>
            </CardHeader>
            <CardContent>
                <p key="address">アドレス：{address}</p>
                <p key="balance">所持残高：{tokenBalance}</p>
                <p key="deposit">預入残高：{bankBalance}</p>
            </CardContent>
        </Card>
    );
}
