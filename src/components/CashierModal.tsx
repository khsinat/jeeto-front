import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";
import { functions } from "@/lib/appwrite";

declare global {
  interface Window {
    Razorpay: any;
  }
}
export function CashierModal() {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse query params
  const params = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const isOpen = params.get("modal") === "cashier";
  const tab = params.get("tab") || "deposit";

  // Close handler: remove modal and tab from query params
  const handleClose = () => {
    params.delete("modal");
    params.delete("tab");
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  // Optional: keep tab param in sync with tab changes
  const handleTabChange = (value: string) => {
    params.set("tab", value);
    navigate(`${location.pathname}?${params.toString()}`, { replace: true });
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => { if (!open) handleClose(); }}>
      <DialogContent>
        <Tabs value={tab} onValueChange={handleTabChange}>
          <TabsList className="flex w-full items-center justify-between">
            <TabsTrigger value="deposit" className="flex-1">Deposit</TabsTrigger>
            <span className="h-6 w-px bg-border" aria-hidden="true" />
            <TabsTrigger value="withdraw" className="flex-1">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="deposit">
            {/* Deposit form */}
            <DepositForm />
          </TabsContent>
          <TabsContent value="withdraw">
            {/* Withdraw form or content here */}
            <div>Withdraw Content</div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function DepositForm() {
  const form = useForm<{ amount: number }>();
  const {user}=useAuth()
  if (!user) return null;
  const onSubmit = async (data: { amount: number }) => {
    try {
      // 1. Create Razorpay order via Appwrite function
      const exection = await functions.createExecution(
        '686ca53f00274e52ae44',
        JSON.stringify({amount: data.amount})
      )
      const result = JSON.parse(exection.responseBody);

      if (result.error) {
        toast.error(result.error);
        return;
      }
      console.log(result)
      // 2. Open Razorpay Checkout
      const options = {
        key: result.key,
        amount: result.amount,
        currency: result.currency,
        order_id: result.orderId,
        handler: function (response:any) {
          // Payment success! The webhook will update the balance.
          toast.success("Payment successful! Your balance will update shortly.");
        },
        prefill: {
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error("Error processing payment");
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount to deposit</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={1}
                  step={1}
                  placeholder="Enter amount"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={form.formState.isSubmitting} className="w-full mt-2">Deposit</Button>
      </form>
    </Form>
  );
}