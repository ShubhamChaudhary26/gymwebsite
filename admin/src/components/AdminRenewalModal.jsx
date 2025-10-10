// components/AdminRenewalModal.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "../services/api";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";

const AdminRenewalModal = ({
  subscription,
  open,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  // Fetch plans
  const { data: plans } = useQuery({
    queryKey: ["active-plans"],
    queryFn: () => apiService.getPlans(),
    enabled: open,
  });

  useEffect(() => {
    if (subscription) {
      setSelectedPlanId(subscription.planId._id);
      setPaymentMethod("");
    }
  }, [subscription]);

  if (!subscription) return null;

  const selectedPlan = plans?.data?.find((p) => p._id === selectedPlanId);

  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Renew/Change Subscription</AlertDialogTitle>
          <AlertDialogDescription>
            Renew or change the plan for {subscription.userId.fullname}.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          {/* Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan">Change Plan (Optional)</Label>
            <Select
              id="plan"
              value={selectedPlanId}
              onValueChange={setSelectedPlanId}
            >
              <SelectItem value="">Select new plan</SelectItem>
              {plans?.data?.map((plan) => (
                <SelectItem key={plan._id} value={plan._id}>
                  {plan.name} - ₹{plan.price} ({plan.duration} days)
                </SelectItem>
              ))}
            </Select>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select
              id="payment-method"
              value={paymentMethod}
              onValueChange={setPaymentMethod}
            >
              <SelectItem value="">Select payment method</SelectItem>
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="cheque">Cheque</SelectItem>
              <SelectItem value="upi">UPI</SelectItem>
              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
            </Select>
          </div>

          {/* Summary */}
          {selectedPlan && (
            <div className="bg-muted/50 rounded-lg p-3 text-sm">
              <p>
                <strong>User:</strong> {subscription.userId.fullname}
              </p>
              <p>
                <strong>Selected Plan:</strong> {selectedPlan.name}
              </p>
              <p>
                <strong>Amount to Collect:</strong> ₹{selectedPlan.price}
              </p>
              <p>
                <strong>New Validity:</strong> Starts today for{" "}
                {selectedPlan.duration} days
              </p>
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() =>
              onConfirm({
                planId: selectedPlanId,
                paymentMethod,
              })
            }
            disabled={isLoading || !selectedPlanId || !paymentMethod}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Confirm & Renew"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AdminRenewalModal;
