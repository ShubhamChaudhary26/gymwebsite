// pages/Subscriptions.jsx
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import apiService from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  CreditCard,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  AlertCircle,
  Download,
  Eye,
} from "lucide-react";

const Subscriptions = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Fetch subscriptions
  const { data: subscriptions, isLoading } = useQuery({
    queryKey: ["subscriptions", statusFilter, planFilter],
    queryFn: () =>
      apiService.getSubscriptions({ status: statusFilter, plan: planFilter }),
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: () => apiService.getSubscriptionStats(),
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: (subscriptionId) =>
      apiService.cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries(["subscriptions"]);
      toast.success("Subscription cancelled successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to cancel subscription");
    },
  });

  // Filter subscriptions
  // pages/Subscriptions.jsx - UPDATE FILTER LOGIC
  const filteredSubscriptions = useMemo(() => {
    // ✅ FIX: Handle both array and nested data structure
    const subscriptionList = Array.isArray(subscriptions?.data)
      ? subscriptions.data
      : subscriptions?.data?.subscriptions || [];

    if (!subscriptionList || subscriptionList.length === 0) return [];

    return subscriptionList.filter((sub) => {
      const matchesSearch =
        sub.userId?.fullname
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        sub.userId?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.razorpayPaymentId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDate =
        (!dateRange.start ||
          new Date(sub.createdAt) >= new Date(dateRange.start)) &&
        (!dateRange.end || new Date(sub.createdAt) <= new Date(dateRange.end));

      return matchesSearch && matchesDate;
    });
  }, [subscriptions?.data, searchTerm, dateRange]);

  // Also fix stats display
  const statsData = stats?.data || stats || {};
  // Export to CSV
  const exportToCSV = () => {
    const csv = [
      ["User", "Email", "Plan", "Amount", "Status", "Start Date", "End Date"],
      ...filteredSubscriptions.map((sub) => [
        sub.userId?.fullname,
        sub.userId?.email,
        sub.planId?.name,
        sub.amount,
        sub.status,
        new Date(sub.startDate).toLocaleDateString(),
        new Date(sub.endDate).toLocaleDateString(),
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscriptions-${new Date().toISOString()}.csv`;
    a.click();
  };

  const getStatusColor = (status) => {
    const colors = {
      active: "success",
      pending: "warning",
      expired: "secondary",
      cancelled: "destructive",
      failed: "destructive",
    };
    return colors[status] || "default";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscription Management</h1>
        <Button onClick={exportToCSV} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 mr-2 text-green-600" />
              <span className="text-2xl font-bold">
                {formatCurrency(stats?.totalRevenue || 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats?.revenueGrowth || 0}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-2xl font-bold">
                {stats?.activeSubscriptions || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats?.newThisMonth || 0} new this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Expiring Soon
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 mr-2 text-orange-600" />
              <span className="text-2xl font-bold">
                {stats?.expiringSoon || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Within next 7 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg. Subscription Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 mr-2 text-purple-600" />
              <span className="text-2xl font-bold">
                {formatCurrency(stats?.avgValue || 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Per subscription
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by user, email or payment ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </Select>

            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="Basic">Basic</SelectItem>
              <SelectItem value="Premium">Premium</SelectItem>
              <SelectItem value="Pro">Pro</SelectItem>
            </Select>

            <Input
              type="date"
              placeholder="Start Date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ ...dateRange, start: e.target.value })
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
            </div>
          ) : filteredSubscriptions.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No subscriptions found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Days Left</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((sub) => {
                  const daysLeft = Math.ceil(
                    (new Date(sub.endDate) - new Date()) / (1000 * 60 * 60 * 24)
                  );

                  return (
                    <TableRow key={sub._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {sub.userId?.fullname}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {sub.userId?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{sub.planId?.name}</Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(sub.amount)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(sub.status)}>
                          {sub.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(sub.startDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {new Date(sub.endDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {sub.status === "active" ? (
                          <span
                            className={
                              daysLeft <= 7 ? "text-orange-600 font-medium" : ""
                            }
                          >
                            {daysLeft > 0 ? `${daysLeft} days` : "Expired"}
                          </span>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedSubscription(sub)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {sub.status === "active" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (
                                  confirm(
                                    "Are you sure you want to cancel this subscription?"
                                  )
                                ) {
                                  cancelMutation.mutate(sub._id);
                                }
                              }}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Subscription Details Dialog */}
      <Dialog
        open={!!selectedSubscription}
        onOpenChange={() => setSelectedSubscription(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Subscription Details</DialogTitle>
          </DialogHeader>
          {selectedSubscription && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Customer
                  </label>
                  <p className="font-medium">
                    {selectedSubscription.userId?.fullname}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedSubscription.userId?.email}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Plan
                  </label>
                  <p className="font-medium">
                    {selectedSubscription.planId?.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatCurrency(selectedSubscription.amount)}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Payment ID
                  </label>
                  <p className="font-mono text-sm">
                    {selectedSubscription.razorpayPaymentId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Order ID
                  </label>
                  <p className="font-mono text-sm">
                    {selectedSubscription.razorpayOrderId}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Duration
                  </label>
                  <p>
                    {new Date(
                      selectedSubscription.startDate
                    ).toLocaleDateString()}{" "}
                    -{" "}
                    {new Date(
                      selectedSubscription.endDate
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <Badge variant={getStatusColor(selectedSubscription.status)}>
                    {selectedSubscription.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscriptions;
