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
import useAuth from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { databases } from "@/lib/appwrite";
import { Query } from "appwrite";
import {toast} from "sonner";
import {functions, account,client} from "../lib/appwrite"

export default function GeneratedForm() {
    const [balance, setBalance] = useState(0);
    const user = useAuth();
    useEffect(() => {
        const fetchBalance = async () => {
            if (user) {
                const userBalance = await databases.listDocuments(
                    "685d619e00286d9805b7",
                    "users",
                    [Query.equal("userId", user.userId)]
                );
                setBalance(userBalance.documents[0]?.balance || 0);
            }
        };
        fetchBalance();
    }, [user]);

    const formSchema = z.object({
        "text-0": z.string(),
        "number-input-0": z.coerce
            .number({
                invalid_type_error: "This field must be a number",
            })
            .min(5, { message: "Minimum bet is 5" })
            .refine((val) => val <= balance, {
                message: `Amount cannot exceed your balance (${balance})`,
            }),
        "textarea-0": z.string().min(1,{message: 
            "atleast len of 1"
        }),
        "button-1": z.string().optional(),
        "button-2": z.string().optional(),
        "button-0": z.string().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            "text-0": "",
            "number-input-0": undefined,
            "textarea-0": "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const betAmount = values["number-input-0"];
            const userInput = values["textarea-0"];
        
            // Optional: Validate input before sending
            if (!userInput.trim()) {
              toast.error("Please enter your guess.");
              return;
            }
            console.log("Client config:", {
                endpoint: client.config.endpoint,
                project: client.config.project,
                headers: client.headers
            });
                    
        const session = await account.getSession('current');
        console.log("Current session:", session);
        console.log("Session token:", session.$id);
        
        // Check if client has the session
        console.log("Client headers after session:", client.headers);
            try {
                
                const currentUser = await account.get();
                console.log("Current user before function execution:", currentUser);
                console.log("User ID:", currentUser.$id);
            } catch (error) {
                console.error("No valid session found:", error);
                toast.error("Please log in again.");
                return;
            }
            //Show loading toast
            const loadingId = toast.loading("Processing your bet...");
        
            // Call the Appwrite function (server-side authentication is automatic)
            const execution = await functions.createExecution(
              "686a4b2e002ba5047863", // Replace with your actual function ID
              JSON.stringify({
                betAmount,
                userInput
              })
            );
        
            // Parse the result
            const result = JSON.parse(execution.responseBody);
        
            // Handle errors from the function
            if (result.error) {
              toast.dismiss(loadingId);
              toast.error(result.error);
              return;
            }
        
            // Update local balance state
            setBalance(result.newBalance);
        
            // Show result to user
            toast.dismiss(loadingId);
            toast.success("Bet completed!", {
              description: `Similarity: ${(result.similarityScore * 100).toFixed(2)}% | Winnings: ${result.winnings}`,
            });
        
            // Optionally reset the form
            form.reset();
        
          } catch (err) {
            toast.dismiss();
            toast.error("Error submitting bet");
            console.error(err);
          }
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
                                            onClick={() => {
                                                const current = Number(form.getValues("number-input-0"));
                                                if (isNaN(current) || current < 5) {
                                                    form.setValue("number-input-0", 5);
                                                } else {
                                                    const newValue = Math.max(current / 2, 5);
                                                    form.setValue("number-input-0", newValue,
                                                        {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                            shouldTouch: true,
                                                          }
                                                    );
                                                }
                                            }}
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
                                            onClick={() => {
                                                const current = Number(form.getValues("number-input-0"));
                                                if (isNaN(current) || current < 5) {
                                                    form.setValue("number-input-0", 5);
                                                } else {
                                                    form.setValue("number-input-0", current * 2,
                                                        {
                                                            shouldValidate: true,
                                                            shouldDirty: true,
                                                            shouldTouch: true,
                                                          }
                                                    );
                                                }
                                            }}
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
                                            disabled={!form.formState.isValid}
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
