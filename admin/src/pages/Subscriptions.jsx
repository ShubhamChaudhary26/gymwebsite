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
import OfflineSubscriptionModal from "../components/OfflineSubscriptionModal";
import {
  Search,
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Download,
  Eye,
  Edit,
  Plus,
} from "lucide-react";
import SimpleSubscriptionDetails from "../components/SimpleSubscriptionDetails";
import AdminRenewalModal from "@/components/AdminRenewalModal";
import EditSubscriptionModal from "@/components/EditSubscriptionModal";
const Subscriptions = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [planFilter, setPlanFilter] = useState("all");
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [renewalCandidate, setRenewalCandidate] = useState(null);
  const [editCandidate, setEditCandidate] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: "",
    end: "",
  });

  // Fetch subscriptions
  const { data: subscriptionsResponse, isLoading } = useQuery({
    // Rename
    queryKey: ["subscriptions", statusFilter, planFilter],
    queryFn: () =>
      apiService.getSubscriptions({ status: statusFilter, plan: planFilter }),
  });

  // Fetch stats
  // pages/Subscriptions.jsx - Line 42-43
  const { data: statsResponse } = useQuery({
    queryKey: ["subscription-stats"],
    queryFn: () => apiService.getSubscriptionStats(),
  });

  const subscriptions = subscriptionsResponse?.data || []; // ✅ FIX
  const stats = statsResponse?.data || {}; // ✅ FIX
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
  const renewMutation = useMutation({
    mutationFn: (subscriptionId) =>
      apiService.adminInitiateRenewal(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      queryClient.invalidateQueries({ queryKey: ["subscription-stats"] });
      toast.success("Subscription renewed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to renew subscription");
    },
  });
  const editMutation = useMutation({
    mutationFn: ({ subscriptionId, data }) =>
      apiService.updateSubscription(subscriptionId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
      toast.success("Subscription updated successfully");
      setEditCandidate(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update subscription");
    },
  });

  // Filter subscriptions
  // pages/Subscriptions.jsx - UPDATE FILTER LOGIC
  const filteredSubscriptions = useMemo(() => {
    if (!subscriptions || subscriptions.length === 0) return [];

    return subscriptions.filter((sub) => {
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
  }, [subscriptions, searchTerm, dateRange]); // ✅ CORRECTED DEPENDENCIES

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
      grace_period: "warning",
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
      <div className="flex gap-2">
        <Button onClick={() => setShowOfflineModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Offline Subscription
        </Button>
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
                {formatCurrency(stats.totalRevenue || 0)}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              +{stats.revenueGrowth || 0}% from last month
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
                {stats.activeSubscriptions || 0}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.newThisMonth || 0} new this month
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
                {stats.expiringSoon || 0}
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
                {formatCurrency(stats.avgValue || 0)}
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
              <SelectItem value="grace_period">Grace Period</SelectItem>
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
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditCandidate(sub)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {/* ✅ SMART RENEWAL BUTTON */}
                          {(sub.status === "active" && daysLeft <= 7) ||
                          sub.status === "grace_period" ? (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setRenewalCandidate(sub)}
                              disabled={renewMutation.isLoading}
                            >
                              Renew
                            </Button>
                          ) : null}

                          {sub.status === "active" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                if (
                                  confirm("Are you sure you want to cancel?")
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

      <SimpleSubscriptionDetails
        subscription={selectedSubscription}
        open={!!selectedSubscription}
        onClose={() => setSelectedSubscription(null)}
      />
      <OfflineSubscriptionModal
        open={showOfflineModal}
        onClose={() => setShowOfflineModal(false)}
        onSuccess={() => {
          queryClient.invalidateQueries(["subscriptions"]);
          queryClient.invalidateQueries(["subscription-stats"]);
          toast.success("Offline subscription created successfully!");
          setShowOfflineModal(false);
        }}
      />
      <AdminRenewalModal
        subscription={renewalCandidate}
        open={!!renewalCandidate}
        onClose={() => setRenewalCandidate(null)}
        onConfirm={(renewalData) => {
          if (renewalCandidate) {
            renewMutation.mutate({
              subscriptionId: renewalCandidate._id,
              ...renewalData,
            });
            setRenewalCandidate(null);
          }
        }}
        isLoading={renewMutation.isLoading}
      />
      <EditSubscriptionModal
        subscription={editCandidate}
        open={!!editCandidate}
        onClose={() => setEditCandidate(null)}
        onConfirm={(data) => {
          if (editCandidate) {
            editMutation.mutate({
              subscriptionId: editCandidate._id,
              data,
            });
          }
        }}
        isLoading={editMutation.isLoading}
      />
    </div>
  );
};

export default Subscriptions;
