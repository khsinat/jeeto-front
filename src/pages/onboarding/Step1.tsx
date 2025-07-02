import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import { Navigate, useNavigate } from 'react-router'
import { LetterText, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";

import { Button } from '@/components/ui/button'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,

} from "@/components/ui/form";
import { PhoneInput } from '@/components/LoginAndRegister/phone-input'
import useAuth from '@/hooks/useAuth'
import { databases } from '@/lib/appwrite'
import { Query } from 'appwrite'
import { toast } from 'sonner'

const FormSchema = z.object({
    phone: z
        .string()
        .refine(isValidPhoneNumber, { message: "Invalid phone number" }),
    userName: z.string().min(1, { message: "Username must be at least 3 characters long" }),
})
const Step1 = () => {
    const navigate = useNavigate()
    const { user, userId, setOnBoarded } = useAuth();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            phone: "",
            userName: "",
        }
    })

    async function onSubmit(data: z.infer<typeof FormSchema>) {
        try {
            const doc = await databases.listDocuments('685d619e00286d9805b7', 'users', [Query.equal('userId', userId)])
            await databases.updateDocument('685d619e00286d9805b7', 'users', doc.documents[0].$id, {
                phone: data.phone,
                userName: data.userName,
                onBoardstep: "2"
            })
            setOnBoarded("2")
            console.log("onboarding step 1 completed")
            toast("Onboarding step 1 completed successfully")
            navigate('/notifications')
        } catch (error) {
            console.error("some eerror occur", error)
        }


    }
    return (
        <div className='flex flex-col w-full h-screen justify-center items-center '>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="w-90 flex flex-col gap-6 "
                >
                    <FormField
                        control={form.control}
                        name="userName"
                        render={({ field }) => (
                            <FormItem className=''>
                                <FormLabel className='text-left'>Username</FormLabel>
                                <FormControl className="w-full">
                                    <Input placeholder="userName" {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                            <FormItem className="">
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

                    <Button type="submit" className="w-full" disabled={!form.formState.isValid}>Submit</Button>
                    {/* <pre>
                    <code className="text-foreground">
                        {JSON.stringify(form.watch("phone"), null, 2)}
                    </code>
                </pre> */}
                </form>
            </Form>
        </div>
    )
}

export default Step1