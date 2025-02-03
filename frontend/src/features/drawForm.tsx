import { Button } from "@/components/shadcn/button";
import { Input } from "@/components/shadcn/input";

import Form from 'next/form';

export default function DrawForm() {
    return (
        <Form action={""} className="flex justify-center items-center gap-4 m-3">
            <Input type="text" placeholder={`100`} />
            <Button type="submit" variant="commit">引出</Button>
        </Form>
    );
}