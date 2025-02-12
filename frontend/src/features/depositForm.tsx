import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";
import { useActionState } from "react";

import Form from "next/form";

export default function DepositForm() {
    /*
    const [_, formAction, isPending] = useActionState(async (_, data: FormData) => {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        console.log("depositVal");
    }, null);
    */

    return (
        <Form action="" className="flex justify-center items-center gap-4 m-3">
            <Input type="text" name="depositVal" placeholder={`100`} />
            <Button type="submit" variant="commit" disabled={isPending}>
                預入
            </Button>
        </Form>
    );
}
