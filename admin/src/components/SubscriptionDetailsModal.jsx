// components/SubscriptionDetailsModal.jsx
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import apiService from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Select, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  User,
  CreditCard,
  Calendar,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Edit,
  Plus,
  History,
} from "lucide-react";

const SubscriptionDetailsModal = ({ subscription, open, onClose }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("details");
  const [extendDays, setExtendDays] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [note, setNote] = useState("");
  const [showExtendDialog, setShowExtendDialog] = useState(false);
  const [showChangePlanDialog, setShowChangePlanDialog] = useState(false);

  // Fetch plans for change plan feature
  const { data: plans } = useQuery({
    queryKey: ["active-plans"],
    queryFn: () => apiService.getPlans(),
    enabled: open && showChangePlanDialog,
  });

  // Fetch user's subscription history
  const { data: history } = useQuery({
    queryKey: ["subscription-history", subscription?.userId?._id],
    queryFn: () =>
      apiService.getUserSubscriptionHistory(subscription.userId._id),
    enabled: open && !!subscription?.userId?._id && activeTab === "history",
  });

  // Extend subscription mutation
  const extendMutation = useMutation({
    mutationFn: ({ subscriptionId, days }) =>
      apiService.extendSubscription(subscriptionId, days),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptions"]);
      toast.success("Subscription extended successfully");
      setShowExtendDialog(false);
      setExtendDays("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to extend subscription");
    },
  });

  // Change plan mutation
  const changePlanMutation = useMutation({
    mutationFn: ({ subscriptionId, planId }) =>
      apiService.changeSubscriptionPlan(subscriptionId, planId),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptions"]);
      toast.success("Plan changed successfully");
      setShowChangePlanDialog(false);
      setSelectedPlanId("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to change plan");
    },
  });

  // Add note mutation
  const addNoteMutation = useMutation({
    mutationFn: ({ subscriptionId, note }) =>
      apiService.addSubscriptionNote(subscriptionId, note),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptions"]);
      toast.success("Note added successfully");
      setNote("");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add note");
    },
  });

  if (!subscription) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "expired":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "grace_period":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      pending: "warning",
      expired: "secondary",
      cancelled: "destructive",
      failed: "destructive",
      grace_period: "warning",
    };
    return colors[status] || "default";
  };

  const daysRemaining = Math.ceil(
    (new Date(subscription.endDate) - new Date()) / (1000 * 60 * 60 * 24)
  );

  const daysSinceStart = Math.ceil(
    (new Date() - new Date(subscription.startDate)) / (1000 * 60 * 60 * 24)
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Subscription Details</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="payment">Payment</TabsTrigger>
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* User Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">
                      {subscription.userId?.fullname}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{subscription.userId?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Username</p>
                    <p className="font-medium">
                      @{subscription.userId?.username}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Plan Info Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Plan Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Plan Name</p>
                    <p className="font-medium">{subscription.planId?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Amount</p>
                    <p className="font-medium">
                      {formatCurrency(subscription.amount)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {subscription.planId?.duration} days
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Subscription Status Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Subscription Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(subscription.status)}
                      <Badge variant={getStatusColor(subscription.status)}>
                        {subscription.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Start Date</p>
                    <p className="font-medium">
                      {new Date(subscription.startDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">End Date</p>
                    <p className="font-medium">
                      {new Date(subscription.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Duration Stats Card */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Duration Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-sm text-muted-foreground">Days Used</p>
                    <p className="font-medium">{daysSinceStart} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Days Remaining
                    </p>
                    <p
                      className={`font-medium ${
                        daysRemaining <= 7 ? "text-orange-600" : ""
                      }`}
                    >
                      {daysRemaining > 0 ? `${daysRemaining} days` : "Expired"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Renewal Count
                    </p>
                    <p className="font-medium">
                      {subscription.renewalCount || 0} times
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            {subscription.planId?.features && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Plan Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="grid grid-cols-2 gap-2">
                    {subscription.planId.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Payment Tab */}
          <TabsContent value="payment" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Payment Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment ID</p>
                    <p className="font-mono text-sm">
                      {subscription.razorpayPaymentId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono text-sm">
                      {subscription.razorpayOrderId || "N/A"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Payment Method
                    </p>
                    <p className="font-medium">
                      {subscription.paymentDetails?.method || "Online"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Transaction ID
                    </p>
                    <p className="font-mono text-sm">
                      {subscription.paymentDetails?.transactionId || "N/A"}
                    </p>
                  </div>
                </div>
                {subscription.paymentDetails?.notes && (
                  <div>
                    <p className="text-sm text-muted-foreground">Notes</p>
                    <p className="text-sm">
                      {subscription.paymentDetails.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Extend Validity */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Extend Validity</CardTitle>
                  <CardDescription>
                    Add more days to the subscription
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showExtendDialog ? (
                    <Button
                      onClick={() => setShowExtendDialog(true)}
                      disabled={subscription.status === "cancelled"}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Extend Days
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Input
                        type="number"
                        placeholder="Number of days"
                        value={extendDays}
                        onChange={(e) => setExtendDays(e.target.value)}
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (extendDays && extendDays > 0) {
                              extendMutation.mutate({
                                subscriptionId: subscription._id,
                                days: parseInt(extendDays),
                              });
                            }
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowExtendDialog(false);
                            setExtendDays("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Change Plan */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Change Plan</CardTitle>
                  <CardDescription>
                    Upgrade or downgrade the plan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!showChangePlanDialog ? (
                    <Button
                      onClick={() => setShowChangePlanDialog(true)}
                      disabled={subscription.status !== "active"}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Change Plan
                    </Button>
                  ) : (
                    <div className="space-y-3">
                      <Select
                        value={selectedPlanId}
                        onValueChange={setSelectedPlanId}
                      >
                        <SelectItem value="">Select new plan</SelectItem>
                        {plans?.data
                          ?.filter((p) => p._id !== subscription.planId._id)
                          .map((plan) => (
                            <SelectItem key={plan._id} value={plan._id}>
                              {plan.name} - ₹{plan.price}
                            </SelectItem>
                          ))}
                      </Select>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            if (selectedPlanId) {
                              changePlanMutation.mutate({
                                subscriptionId: subscription._id,
                                planId: selectedPlanId,
                              });
                            }
                          }}
                        >
                          Confirm
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setShowChangePlanDialog(false);
                            setSelectedPlanId("");
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Note */}
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Add Note</CardTitle>
                  <CardDescription>
                    Add internal notes about this subscription
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    placeholder="Enter note..."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />
                  <Button
                    onClick={() => {
                      if (note.trim()) {
                        addNoteMutation.mutate({
                          subscriptionId: subscription._id,
                          note: note.trim(),
                        });
                      }
                    }}
                  >
                    Add Note
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Subscription History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {history?.data?.length > 0 ? (
                  <div className="space-y-3">
                    {history.data.map((item, idx) => (
                      <div
                        key={idx}
                        className="border-l-2 border-muted pl-4 pb-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{item.action}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(item.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <Badge variant="outline">{item.type}</Badge>
                        </div>
                        {item.details && (
                          <p className="text-sm mt-1">{item.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    No history available
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default SubscriptionDetailsModal;
