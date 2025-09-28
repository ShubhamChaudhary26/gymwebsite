// components/SimpleSubscriptionDetails.jsx
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  User,
  CreditCard,
  Calendar,
  DollarSign,
  CheckCircle,
} from "lucide-react";

const SimpleSubscriptionDetails = ({ subscription, open, onClose }) => {
  if (!subscription) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      pending: "warning",
      expired: "secondary",
      cancelled: "destructive",
      grace_period: "warning",
    };
    return colors[status] || "default";
  };

  const daysRemaining = Math.ceil(
    (new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Row 1: Customer & Plan Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Customer Info */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Customer Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Name:</span>
                  <p className="font-medium">{subscription.userId?.fullname}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Email:</span>
                  <p className="font-medium">{subscription.userId?.email}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Username:</span>
                  <p className="font-medium">
                    @{subscription.userId?.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Plan Info */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Plan Details
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Plan Name:</span>
                  <p className="font-medium">{subscription.planId?.name}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Amount:</span>
                  <p className="font-medium">
                    {formatCurrency(subscription.amount)}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration:</span>
                  <p className="font-medium">
                    {subscription.planId?.duration} days
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2: Subscription Status & Payment Info */}
          <div className="grid grid-cols-2 gap-4">
            {/* Subscription Status */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Subscription Status
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <div className="mt-1">
                    <Badge variant={getStatusColor(subscription.status)}>
                      {subscription.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <p className="font-medium">
                    {new Date(subscription.startDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">End Date:</span>
                  <p className="font-medium">
                    {new Date(subscription.endDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Days Remaining:</span>
                  <p
                    className={`font-medium ${
                      daysRemaining <= 7 ? "text-orange-600" : ""
                    }`}
                  >
                    {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="border rounded-lg p-4">
              <h3 className="font-medium mb-3 flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Payment Information
              </h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Payment ID:</span>
                  <p className="font-mono text-xs break-all">
                    {subscription.razorpayPaymentId || "N/A"}
                  </p>
                </div>
                <div>
                  <span className="text-muted-foreground">Order ID:</span>
                  <p className="font-mono text-xs break-all">
                    {subscription.razorpayOrderId || "N/A"}
                  </p>
                </div>
                {subscription.paymentDetails?.method && (
                  <div>
                    <span className="text-muted-foreground">Method:</span>
                    <p className="font-medium">
                      {subscription.paymentDetails.method.toUpperCase()}
                    </p>
                  </div>
                )}
                {subscription.renewalCount > 0 && (
                  <div>
                    <span className="text-muted-foreground">Renewals:</span>
                    <p className="font-medium">
                      {subscription.renewalCount} times
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Features - Full Width */}
          {subscription.planId?.features &&
            subscription.planId.features.length > 0 && (
              <div className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Plan Features</h3>
                <div className="grid grid-cols-2 gap-2">
                  {subscription.planId.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* Warnings if any */}
          {subscription.status === "grace_period" && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm font-medium text-orange-900">
                ⚠️ Grace Period Active - Renew soon to avoid service
                interruption
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SimpleSubscriptionDetails;
