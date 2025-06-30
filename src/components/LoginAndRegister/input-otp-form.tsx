"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { account } from "@/lib/appwrite"
import { useNavigate } from "react-router"
import useAuth from "@/hooks/useAuth"

const otpSchema = z.object({
    pin: z.string().min(6, {
        message: "Your one-time password must be 6 characters.",
    }),
})

export function InputOTPForm() {
    const form = useForm<z.infer<typeof otpSchema>>({
        resolver: zodResolver(otpSchema),
        defaultValues: {
            pin: "",
        },
    })
    const navigate = useNavigate()
    const { userId, verifyEmailToken, user } = useAuth()
    console.log("user", user)
    console.log("userId", userId)
    async function onotpSubmit(data: z.infer<typeof otpSchema>) {
        try {
            console.log(data.pin)
            await verifyEmailToken(userId, data.pin)
            console.log("after verification")
            // const session = await account.createSession(userId, data.pin)
            // console.log("session");
            // console.log(session)
            // if (user) {
            //     toast.success("Login successful!")
            //     navigate("/")
            // } else {
            //     toast.error("Login failed. Please try again.")
            // }
        } catch (e) {
            toast.error("Invalid OTP. Please try again.")
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onotpSubmit)} className="w-full space-y-6 ">
                <FormField
                    control={form.control}
                    name="pin"
                    render={({ field }) => (
                        <FormItem className="justify-center w-full">
                            {/* <FormLabel className="justify-center">One-Time Password</FormLabel> */}
                            <FormControl>
                                <InputOTP maxLength={6} {...field}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={!form.formState.isValid} >Submit</Button>
            </form>
        </Form>
    )
}
