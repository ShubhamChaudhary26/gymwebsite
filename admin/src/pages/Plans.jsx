// pages/Plans.jsx
import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import apiService from "../services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Plus,
  Edit,
  Trash2,
  DollarSign,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Plans = () => {
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [deletePlanId, setDeletePlanId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
  });

  // Fetch plans (including inactive)
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiService.getPlans(true),
  });

  // Mutations
  const createPlanMutation = useMutation({
    mutationFn: (planData) => apiService.createPlan(planData),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan created successfully");
      setShowCreateDialog(false);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create plan");
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, planData }) =>
      apiService.updatePlan(planId, planData),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan updated successfully");
      setSelectedPlan(null);
      resetForm();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update plan");
    },
  });

  const deletePlanMutation = useMutation({
    mutationFn: (planId) => apiService.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan deleted successfully");
      setDeletePlanId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete plan");
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: (planId) => apiService.togglePlanStatus(planId),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan status updated");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update status");
    },
  });

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration: "",
      features: "",
    });
  };

  const handleEdit = (plan) => {
    setSelectedPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features.join("\n"),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const planData = {
      name: formData.name,
      price: Number(formData.price),
      duration: Number(formData.duration),
      features: formData.features.split("\n").filter((f) => f.trim()),
    };

    if (selectedPlan) {
      updatePlanMutation.mutate({
        planId: selectedPlan._id,
        planData,
      });
    } else {
      createPlanMutation.mutate(planData);
    }
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
        <h1 className="text-3xl font-bold">Plans Management</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Plan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {["Basic", "Premium", "Pro"].map((planName) => {
          const plan = plans?.data?.find((p) => p.name === planName);
          if (!plan) return null;

          return (
            <Card key={planName}>
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <Badge variant={plan.isActive ? "success" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-2xl font-bold">
                    {formatCurrency(plan.price)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-1" />
                    {plan.duration} days
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {plan.features.length} features
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Plans</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans?.data?.map((plan) => (
                  <TableRow key={plan._id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell>{formatCurrency(plan.price)}</TableCell>
                    <TableCell>{plan.duration} days</TableCell>
                    <TableCell>
                      <div className="max-w-xs">
                        <ul className="text-sm space-y-1">
                          {plan.features.slice(0, 2).map((feature, idx) => (
                            <li key={idx} className="flex items-start">
                              <CheckCircle className="h-3 w-3 mr-1 mt-0.5 text-green-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                          {plan.features.length > 2 && (
                            <li className="text-muted-foreground">
                              +{plan.features.length - 2} more
                            </li>
                          )}
                        </ul>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={plan.isActive}
                        onCheckedChange={() =>
                          toggleStatusMutation.mutate(plan._id)
                        }
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setDeletePlanId(plan._id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog
        open={showCreateDialog || !!selectedPlan}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setSelectedPlan(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
            <DialogDescription>
              {selectedPlan
                ? "Update the plan details below"
                : "Fill in the details to create a new plan"}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Plan Name</label>
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="e.g., Basic, Premium, Pro"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Price (₹)</label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                placeholder="999"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">Duration (days)</label>
              <Input
                type="number"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                placeholder="30"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium">
                Features (one per line)
              </label>
              <Textarea
                value={formData.features}
                onChange={(e) =>
                  setFormData({ ...formData, features: e.target.value })
                }
                placeholder="Access to gym equipment&#10;Locker facility&#10;Diet consultation"
                rows={5}
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowCreateDialog(false);
                  setSelectedPlan(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {selectedPlan ? "Update Plan" : "Create Plan"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deletePlanId}
        onOpenChange={() => setDeletePlanId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the plan. This action cannot be
              undone. Make sure no active subscriptions are using this plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletePlanMutation.mutate(deletePlanId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Plans;
