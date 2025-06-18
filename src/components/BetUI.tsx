"use client";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function GeneratedForm() {
    const formSchema = z.object({
        "text-0": z.string(),
        "number-input-0": z.coerce
            .number({
                invalid_type_error: "This field must be a number",
            })
            .min(1, { message: "This field is required" }),
        "textarea-0": z.string(),
        "button-1": z.string().optional(),
        "button-2": z.string().optional(),
        "button-0": z.string().optional(),

    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "text-0": "",
            "number-input-0": 1,
            "textarea-0": "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values);
    }

    function onReset() {
        form.reset();
        form.clearErrors();
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                onReset={onReset}
                className="space-y-8 @container"
            >
                <div className="grid grid-cols-12 gap-4">
                    <div
                        key="text-0"
                        id="text-0"
                        className="font-semibold col-span-12 col-start-auto"
                    >
                        <p className="not-first:mt-6">
                            <span className="text-sm font-medium leading-none">
                                Bet Amount
                            </span>
                        </p>
                    </div>

                    <FormField
                        control={form.control}
                        name="number-input-0"
                        render={({ field }) => (
                            <FormItem className="col-span-8 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="hidden shrink-0">Number</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <div className="relative w-full">
                                            <Input
                                                key="number-input-0"
                                                placeholder=""
                                                type="number"
                                                id="number-input-0"
                                                className=" "
                                                {...field}
                                            />
                                        </div>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="button-1"

                        render={({ field }) => (
                            <FormItem className="col-span-2 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="hidden shrink-0">Button</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <Button
                                            key="button-1"
                                            id="button-1"
                                            name=""
                                            className="w-full"
                                            type="button"
                                            variant="outline"
                                        >
                                            1/2x
                                        </Button>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="button-2"
                        render={({ field }) => (
                            <FormItem className="col-span-2 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="hidden shrink-0">Button</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <Button
                                            key="button-2"
                                            id="button-2"
                                            name=""
                                            className="w-full"
                                            type="button"
                                            variant="outline"
                                        >
                                            2x
                                        </Button>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="textarea-0"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="flex shrink-0">Your guess</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <Textarea
                                            key="textarea-0"
                                            id="textarea-0"
                                            placeholder=""
                                            className=""
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="button-0"
                        render={({ field }) => (
                            <FormItem className="col-span-12 col-start-auto flex self-end flex-col gap-2 space-y-0 items-start">
                                <FormLabel className="hidden shrink-0">Button</FormLabel>

                                <div className="w-full">
                                    <FormControl>
                                        <Button
                                            key="button-0"
                                            id="button-0"
                                            name=""
                                            className="w-full"
                                            type="submit"
                                            variant="primary_button"
                                        >
                                            Bet
                                        </Button>
                                    </FormControl>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    );
}
