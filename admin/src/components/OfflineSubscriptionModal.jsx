// components/OfflineSubscriptionModal.jsx
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import apiService from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";

const OfflineSubscriptionModal = ({ open, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    userId: "",
    planId: "",
    paymentMethod: "",
    transactionId: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users
  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ["users-for-subscription"],
    queryFn: () => apiService.getUsers({ role: "user", status: "active" }),
    enabled: open,
  });

  // Fetch plans
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["active-plans"],
    queryFn: () => apiService.getPlans(),
    enabled: open,
  });

  // Reset form when modal opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        userId: "",
        planId: "",
        paymentMethod: "",
        transactionId: "",
        notes: "",
      });
      setErrors({});
    }
  }, [open]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.userId) {
      newErrors.userId = "Please select a user";
    }
    if (!formData.planId) {
      newErrors.planId = "Please select a plan";
    }
    if (!formData.paymentMethod) {
      newErrors.paymentMethod = "Please select payment method";
    }
    if (formData.paymentMethod === "cheque" && !formData.transactionId) {
      newErrors.transactionId = "Cheque number is required";
    }
    if (formData.paymentMethod === "upi" && !formData.transactionId) {
      newErrors.transactionId = "UPI transaction ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiService.createOfflineSubscription(formData);

      if (response.success || response.data) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to create subscription",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const selectedPlan = plans?.data?.find((p) => p._id === formData.planId);
  const selectedUser = users?.data?.find((u) => u._id === formData.userId);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Offline Subscription</DialogTitle>
          <DialogDescription>
            Manually add a subscription for cash, cheque, or UPI payments
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.submit && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          {/* User Selection */}
          <div className="space-y-2">
            <Label htmlFor="user">Select User *</Label>
            <Select
              value={formData.userId}
              onValueChange={(value) => handleChange("userId", value)}
              disabled={usersLoading}
            >
              <SelectTrigger id="user">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {users?.data?.map((user) => (
                  <SelectItem key={user._id} value={user._id}>
                    {user.fullname} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.userId && (
              <p className="text-sm text-red-500">{errors.userId}</p>
            )}
          </div>

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan">Select Plan *</Label>
            <Select
              value={formData.planId}
              onValueChange={(value) => handleChange("planId", value)}
              disabled={plansLoading}
            >
              <SelectTrigger id="plan">
                <SelectValue placeholder="Choose a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans?.data?.map((plan) => (
                  <SelectItem key={plan._id} value={plan._id}>
                    {plan.name} - ₹{plan.price} ({plan.duration} days)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.planId && (
              <p className="text-sm text-red-500">{errors.planId}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="payment-method">Payment Method *</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) => handleChange("paymentMethod", value)}
            >
              <SelectTrigger id="payment-method">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="cheque">Cheque</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-sm text-red-500">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Transaction ID */}
          {(formData.paymentMethod === "cheque" ||
            formData.paymentMethod === "upi" ||
            formData.paymentMethod === "bank_transfer") && (
            <div className="space-y-2">
              <Label htmlFor="transaction-id">
                {formData.paymentMethod === "cheque"
                  ? "Cheque Number"
                  : formData.paymentMethod === "upi"
                  ? "UPI Transaction ID"
                  : "Transaction Reference"}
                {formData.paymentMethod !== "cash" && " *"}
              </Label>
              <Input
                id="transaction-id"
                value={formData.transactionId}
                onChange={(e) => handleChange("transactionId", e.target.value)}
                placeholder={
                  formData.paymentMethod === "cheque"
                    ? "Enter cheque number"
                    : "Enter transaction ID"
                }
              />
              {errors.transactionId && (
                <p className="text-sm text-red-500">{errors.transactionId}</p>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Any additional notes..."
              rows={3}
            />
          </div>

          {/* Summary */}
          {selectedPlan && selectedUser && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <h4 className="font-medium">Summary</h4>
              <div className="text-sm space-y-1">
                <p>User: {selectedUser.fullname}</p>
                <p>Plan: {selectedPlan.name}</p>
                <p>Amount: ₹{selectedPlan.price}</p>
                <p>Duration: {selectedPlan.duration} days</p>
                <p>Payment: {formData.paymentMethod.toUpperCase()}</p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Subscription"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default OfflineSubscriptionModal;
