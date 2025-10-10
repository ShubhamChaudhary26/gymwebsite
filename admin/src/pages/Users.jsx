// pages/Users.jsx
import { useState, useEffect, useMemo } from "react";
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
import { Select, SelectItem } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  UserPlus,
  Shield,
  ShieldOff,
  Trash2,
  Edit,
  RefreshCw,
} from "lucide-react";
import UserForm from "../components/UserForm";
import useAuthStore from "../stores/authStore";

const Users = () => {
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateAdminDialog, setShowCreateAdminDialog] = useState(false);
  const [showCreateUserDialog, setShowCreateUserDialog] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  // Fetch users
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", roleFilter, statusFilter],
    queryFn: () =>
      apiService.getUsers({ role: roleFilter, status: statusFilter }),
  });

  // Mutations
  const promoteMutation = useMutation({
    mutationFn: (userId) => apiService.promoteToAdmin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User promoted to admin successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to promote user");
    },
  });

  const demoteMutation = useMutation({
    mutationFn: (userId) => apiService.demoteFromAdmin(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Admin access removed successfully");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to demote admin");
    },
  });

  const createAdminMutation = useMutation({
    mutationFn: (adminData) => apiService.createAdmin(adminData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("Admin created successfully");
      setShowCreateAdminDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create admin");
    },
  });

  const createUserMutation = useMutation({
    mutationFn: (userData) => apiService.createUser(userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User created successfully");
      setShowCreateUserDialog(false);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to create user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ userId, userData }) =>
      apiService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User updated successfully");
      setSelectedUser(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId) => apiService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(["users"]);
      toast.success("User deleted successfully");
      setDeleteUserId(null);
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete user");
    },
  });

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];

    return data.data.filter((user) => {
      const matchesSearch =
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesSearch;
    });
  }, [data?.data, searchTerm]);

  // Stats
  const stats = useMemo(() => {
    if (!data?.data) return { total: 0, admins: 0, users: 0, active: 0 };

    return {
      total: data.data.length,
      admins: data.data.filter((u) => u.role === "admin").length,
      users: data.data.filter((u) => u.role === "user").length,
      active: data.data.filter((u) => u.isActive).length,
    };
  }, [data?.data]);

  const handlePromote = (userId) => {
    if (
      window.confirm("Are you sure you want to promote this user to admin?")
    ) {
      promoteMutation.mutate(userId);
    }
  };

  const handleDemote = (userId) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot remove your own admin access");
      return;
    }
    if (
      window.confirm(
        "Are you sure you want to remove admin access from this user?"
      )
    ) {
      demoteMutation.mutate(userId);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <p className="text-red-500">Error loading users: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">User Management</h1>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowCreateUserDialog(true)}
            variant="outline"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Create User
          </Button>
          <Button onClick={() => setShowCreateAdminDialog(true)}>
            <Shield className="mr-2 h-4 w-4" />
            Create Admin
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Admins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.admins}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Regular Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.users}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search - Full width on mobile, flex-1 on desktop */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters - Stack on mobile, side by side on desktop */}
            <div className="flex flex-col sm:flex-row gap-2 lg:gap-4">
              <div className="w-full sm:w-[160px]">
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </Select>
              </div>

              <div className="w-full sm:w-[160px]">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar} alt={user.fullname} />
                          <AvatarFallback>
                            {user.fullname?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{user.fullname}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.role === "admin" ? "default" : "secondary"
                        }
                      >
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.isActive ? "success" : "destructive"}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        {/* Edit Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditUser(user)}
                          title="Edit user"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        {/* Promote/Demote Button */}
                        {user.role === "user" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePromote(user._id)}
                            disabled={promoteMutation.isLoading}
                            title="Promote to admin"
                          >
                            <Shield className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDemote(user._id)}
                            disabled={
                              user._id === currentUser?.id ||
                              demoteMutation.isLoading
                            }
                            title={
                              user._id === currentUser?.id
                                ? "Cannot demote yourself"
                                : "Remove admin access"
                            }
                          >
                            <ShieldOff className="h-4 w-4" />
                          </Button>
                        )}

                        {/* Delete Button */}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteUserId(user._id)}
                          disabled={user._id === currentUser?.id}
                          title={
                            user._id === currentUser?.id
                              ? "Cannot delete yourself"
                              : "Delete user"
                          }
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

      {/* Create Admin Dialog */}
      <Dialog
        open={showCreateAdminDialog}
        onOpenChange={setShowCreateAdminDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Admin</DialogTitle>
            <DialogDescription>
              Create a new admin account with full access to the admin panel.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={(data) => createAdminMutation.mutate(data)}
            onCancel={() => setShowCreateAdminDialog(false)}
            loading={createAdminMutation.isLoading}
            isAdmin={true}
          />
        </DialogContent>
      </Dialog>

      {/* Create User Dialog */}
      <Dialog
        open={showCreateUserDialog}
        onOpenChange={setShowCreateUserDialog}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New User</DialogTitle>
            <DialogDescription>
              Create a new user account with basic access.
            </DialogDescription>
          </DialogHeader>
          <UserForm
            onSubmit={(data) => createUserMutation.mutate(data)}
            onCancel={() => setShowCreateUserDialog(false)}
            loading={createUserMutation.isLoading}
            isAdmin={false}
          />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update user information and settings.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <UserForm
              initialData={selectedUser}
              onSubmit={(data) =>
                updateUserMutation.mutate({
                  userId: selectedUser._id,
                  userData: data,
                })
              }
              onCancel={() => setSelectedUser(null)}
              loading={updateUserMutation.isLoading}
              isEdit={true}
              isAdmin={selectedUser.role === "admin"}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteUserId}
        onOpenChange={() => setDeleteUserId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteUserMutation.mutate(deleteUserId)}
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

export default Users;
