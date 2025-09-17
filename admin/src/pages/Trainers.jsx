// pages/Trainers.jsx
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
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, UserPlus, Edit, Trash2, RefreshCw } from "lucide-react";
import TrainerForm from "../components/TrainerForm";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const Trainers = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [deleteTrainerId, setDeleteTrainerId] = useState(null);

  // Fetch trainers
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["trainers"],
    queryFn: () => apiService.getTrainers(),
  });

  // Mutations
  const createTrainerMutation = useMutation({
    mutationFn: (trainerData) => apiService.createTrainer(trainerData),
    onSuccess: () => {
      queryClient.invalidateQueries(["trainers"]);
      toast.success("Trainer created successfully");
      setShowCreateDialog(false);
    },
    onError: (error) =>
      toast.error(error.message || "Failed to create trainer"),
  });

  const updateTrainerMutation = useMutation({
    mutationFn: ({ trainerId, trainerData }) =>
      apiService.updateTrainer(trainerId, trainerData),
    onSuccess: () => {
      queryClient.invalidateQueries(["trainers"]);
      toast.success("Trainer updated successfully");
      setSelectedTrainer(null);
    },
    onError: (error) =>
      toast.error(error.message || "Failed to update trainer"),
  });

  const deleteTrainerMutation = useMutation({
    mutationFn: (trainerId) => apiService.deleteTrainer(trainerId),
    onSuccess: () => {
      queryClient.invalidateQueries(["trainers"]);
      toast.success("Trainer deleted successfully");
      setDeleteTrainerId(null);
    },
    onError: (error) =>
      toast.error(error.message || "Failed to delete trainer"),
  });

  // Filter trainers for search
  const trainers = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.post && t.post.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [data?.data, searchTerm]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-2">
        <p className="text-red-500">Error loading trainers: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Trainer Management</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Trainer
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search trainers by name or post..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trainers Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin h-8 w-8 border-b-2 border-primary rounded-full"></div>
            </div>
          ) : trainers.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No trainers found
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Instagram</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trainers.map((trainer) => (
                  <TableRow key={trainer._id}>
                    <TableCell className="font-medium">
                      {trainer.name}
                    </TableCell>
                    <TableCell>{trainer.post}</TableCell>
                    <TableCell>
                      {trainer.instagramId ? (
                        <a
                          href={`https://instagram.com/${trainer.instagramId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 underline"
                        >
                          @{trainer.instagramId}
                        </a>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell>
                      <img
                        src={trainer.image}
                        alt={trainer.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTrainer(trainer)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteTrainerId(trainer._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Trainer Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Trainer</DialogTitle>
            <DialogDescription>Fill in trainer details.</DialogDescription>
          </DialogHeader>
          <TrainerForm
            onSubmit={(data) => createTrainerMutation.mutate(data)}
            onCancel={() => setShowCreateDialog(false)}
            loading={createTrainerMutation.isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Trainer Dialog */}
      <Dialog
        open={!!selectedTrainer}
        onOpenChange={() => setSelectedTrainer(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Trainer</DialogTitle>
            <DialogDescription>Update trainer details.</DialogDescription>
          </DialogHeader>
          {selectedTrainer && (
            <TrainerForm
              initialData={selectedTrainer}
              isEdit
              onSubmit={(data) =>
                updateTrainerMutation.mutate({
                  trainerId: selectedTrainer._id,
                  trainerData: data,
                })
              }
              onCancel={() => setSelectedTrainer(null)}
              loading={updateTrainerMutation.isLoading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={!!deleteTrainerId}
        onOpenChange={() => setDeleteTrainerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. Trainer will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTrainerMutation.mutate(deleteTrainerId)}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Trainers;
