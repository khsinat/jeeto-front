import { GalleryVerticalEnd } from "lucide-react"

import { cn } from "@/lib/utils"
import { useState } from "react"
import { Link } from "react-router"
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
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"
import { InputOTPForm } from "./input-otp-form"
import useAuth from "@/hooks/useAuth"

const emailSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
})

export function RegisterForm({
    className,
    ...props
}: React.ComponentProps<"div">) {

    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: "",
        },
    })

    const [showOtp, setshowOtp] = useState(false)
    console.log("showOtp", showOtp)
    const { register } = useAuth()
    async function onregisterSubmit(data: z.infer<typeof emailSchema>, e?: React.BaseSyntheticEvent) {
        e?.preventDefault()
        try {
            console.log("register ran")
            console.trace()
            await register(data.email)
            setshowOtp(true)
            // const val = await account.createEmailToken(ID.unique(), data.email, false)
            // console.log("email token")
            // console.log(val)
            // setToken(val.userId)
        } catch (e) {
            console.log(e)
        }
    }
    console.log(showOtp)
    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-center gap-2">
                    <a
                        href="#"
                        className="flex flex-col items-center gap-2 font-medium"
                    >
                        <div className="flex size-8 items-center justify-center rounded-md">
                            <GalleryVerticalEnd className="size-6" />
                        </div>
                        <span className="sr-only">Jeeto AI </span>
                    </a>
                    <h1 className="text-xl font-bold">Create an account Jeeto AI </h1>
                </div>
                <div className="flex flex-col w-full gap-6">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onregisterSubmit)} className="w-full space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem className="w-full">
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="m@example.com" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This is your public email.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={!form.formState.isValid}>Verify</Button>
                        </form>
                    </Form>

                    <Dialog open={showOtp} onOpenChange={setshowOtp}>
                        {/* <DialogTrigger className="w-full" asChild>
                                </DialogTrigger> */}
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Enter the OTP that was sent on {form.getValues("email")}</DialogTitle>
                            </DialogHeader>
                            <InputOTPForm />

                        </DialogContent>
                    </Dialog>

                </div>
                <div className="text-center text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="underline underline-offset-4">
                        Sign In
                    </Link>
                </div>

            </div>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    )
}
