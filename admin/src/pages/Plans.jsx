// pages/Plans.jsx
import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Check } from "lucide-react";

const Plans = () => {
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Fetch plans
  const { data: plans, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: () => apiService.getPlans(),
  });

  // Create plan mutation
  const createPlanMutation = useMutation({
    mutationFn: (planData) => apiService.createPlan(planData),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan created successfully");
      setShowCreateDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create plan");
    },
  });

  // Update plan mutation
  const updatePlanMutation = useMutation({
    mutationFn: ({ planId, planData }) =>
      apiService.updatePlan(planId, planData),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan updated successfully");
      setSelectedPlan(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update plan");
    },
  });

  // Delete plan mutation
  const deletePlanMutation = useMutation({
    mutationFn: (planId) => apiService.deletePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries(["plans"]);
      toast.success("Plan deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete plan");
    },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subscription Plans</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-3 flex justify-center items-center h-64">
            <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full" />
          </div>
        ) : (
          plans?.data?.map((plan) => (
            <Card key={plan._id} className="relative">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{plan.name}</span>
                  <Badge variant={plan.isActive ? "success" : "secondary"}>
                    {plan.isActive ? "Active" : "Inactive"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-3xl font-bold">₹{plan.price}</p>
                  <p className="text-sm text-muted-foreground">
                    for {plan.duration} days
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Features:</p>
                  <ul className="space-y-1">
                    {plan.features?.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm">
                        <Check className="h-3 w-3 mr-2 text-green-600" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (
                        confirm("Are you sure you want to delete this plan?")
                      ) {
                        deletePlanMutation.mutate(plan._id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Plan Dialog */}
      <Dialog
        open={showCreateDialog || !!selectedPlan}
        onOpenChange={() => {
          setShowCreateDialog(false);
          setSelectedPlan(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? "Edit Plan" : "Create New Plan"}
            </DialogTitle>
          </DialogHeader>
          <PlanForm
            initialData={selectedPlan}
            onSubmit={(data) => {
              if (selectedPlan) {
                updatePlanMutation.mutate({
                  planId: selectedPlan._id,
                  planData: data,
                });
              } else {
                createPlanMutation.mutate(data);
              }
            }}
            onCancel={() => {
              setShowCreateDialog(false);
              setSelectedPlan(null);
            }}
            loading={
              createPlanMutation.isLoading || updatePlanMutation.isLoading
            }
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Plan Form Component
const PlanForm = ({ initialData, onSubmit, onCancel, loading }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    price: initialData?.price || "",
    duration: initialData?.duration || "",
    features: initialData?.features?.join("\n") || "",
    isActive: initialData?.isActive ?? true,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      features: formData.features.split("\n").filter(Boolean),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Plan Name</label>
        <Select
          value={formData.name}
          onValueChange={(value) => setFormData({ ...formData, name: value })}
          required
        >
          <SelectItem value="Basic">Basic</SelectItem>
          <SelectItem value="Premium">Premium</SelectItem>
          <SelectItem value="Pro">Pro</SelectItem>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium">Price (₹)</label>
        <Input
          type="number"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
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
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">Features (one per line)</label>
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={4}
          value={formData.features}
          onChange={(e) =>
            setFormData({ ...formData, features: e.target.value })
          }
          placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="isActive"
          checked={formData.isActive}
          onChange={(e) =>
            setFormData({ ...formData, isActive: e.target.checked })
          }
        />
        <label htmlFor="isActive" className="text-sm">
          Plan is active
        </label>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Plan"}
        </Button>
      </div>
    </form>
  );
};

export default Plans;
