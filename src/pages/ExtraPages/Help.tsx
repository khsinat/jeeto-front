"use client"
import * as z from "zod"
import {
    formSchema
} from './form-schema'
import {
    serverAction
} from '../actions/server-action'
import {
    zodResolver
} from "@hookform/resolvers/zod"
import {
    Button
} from "@/components/ui/button"
import {
    useForm
} from "react-hook-form"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
    FormDescription
} from "@/components/ui/form"
import {
    Input
} from "@/components/ui/input"
import {
    Textarea
} from "@/components/ui/textarea"
import {
    Checkbox
} from "@/components/ui/checkbox"
import React from "react"

const initialState = {
    success: false,
    message: "",
}

export function Help() {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {},
    })

    const [state, action, isPending] = React.useActionState(
        serverAction,
        initialState
    )
    return (
        <div>
            <Form {...form}>
                <form action={action} className="flex flex-col p-2 md:p-5 w-full mx-auto rounded-md max-w-3xl gap-5 border">
                    <h2 className="text-2xl font-bold">Contact us</h2>
                    <p className="text-base">Please fill the form below to contact us</p>

                    <div className="flex items-center justify-between flex-wrap sm:flex-nowrap w-full gap-3">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your name"
                                            type={"text"}
                                            value={field.value}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                field.onChange(val);
                                            }}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )
                            }
                        /><FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem className="w-full">
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Enter your email"
                                            type={"email"}
                                            value={field.value}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                field.onChange(val);
                                            }}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )
                            }
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name="Message"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Message</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        placeholder="Enter your message"
                                        className="resize-none"
                                    />
                                </FormControl>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="agree"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}

                                    />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                    <FormLabel>I agree to the terms and conditions</FormLabel>

                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-end items-center w-full pt-3">
                        <Button className="rounded-lg" size="sm">
                            {isPending ? 'Submitting...' : 'Submit'}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}