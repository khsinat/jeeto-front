import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { isValidPhoneNumber } from "react-phone-number-input";
import { z } from "zod";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "./phone-input";
import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import type { formSchema } from "@/pages/ExtraPages/form-schema";
import { InputOTPForm } from "./input-otp-form";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

const FormSchema = z.object({
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
});
import { account } from "@/lib/appwrite";
import { ID } from "@/lib/appwrite";
export function StandaloneFormExample() {
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            phone: "",
        },
    });

    function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const token = account.createPhoneToken(ID.unique(), data.phone);
            console.log(token);
        } catch (e) {
            console.log(e);
        }

    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col items-start space-y-8"
            >
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem className="flex flex-col items-start w-full">
                            <FormLabel className="text-left">Phone Number</FormLabel>
                            <FormControl className="w-full">
                                <PhoneInput placeholder="Enter a phone number"
                                    international
                                    defaultCountry="IN"
                                    {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {/* <pre>
                    <code className="text-foreground">
                        {JSON.stringify(form.watch("phone"), null, 2)}
                    </code>
                </pre> */}
                <Dialog>
                    <DialogTrigger className="w-full" asChild>

                        <Button type="submit" className="w-full" disabled={!form.formState.isValid}>Verify</Button>

                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Enter the OTP that was sent on {form.getValues("phone")}</DialogTitle>
                        </DialogHeader>
                        {/* <InputOTPForm /> */}

                    </DialogContent>
                </Dialog>

            </form>
        </Form>
    );
}
