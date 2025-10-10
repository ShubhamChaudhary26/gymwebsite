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
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, Edit, Trash2, Eye, RefreshCw } from "lucide-react";
import ProductForm from "../components/ProductForm";
import { AlertDialogDescription } from "@radix-ui/react-alert-dialog";

const Products = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [selectedProductView, setSelectedProductView] = useState(null);
  // Fetch products
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: () => apiService.getProducts(),
  });

  // Mutations
  const createProductMutation = useMutation({
    mutationFn: (formData) => apiService.createProduct(formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product created");
      setShowCreateDialog(false);
    },
    onError: (err) => toast.error(err.message || "Failed to create product"),
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ productId, formData }) =>
      apiService.updateProduct(productId, formData),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product updated");
      setSelectedProduct(null);
    },
    onError: (err) => toast.error(err.message || "Failed to update product"),
  });

  const deleteProductMutation = useMutation({
    mutationFn: (productId) => apiService.deleteProduct(productId),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product deleted");
      setDeleteProductId(null);
    },
    onError: (err) => toast.error(err.message || "Failed to delete product"),
  });

  // Filtered list
  const filteredProducts = useMemo(() => {
    if (!data?.data) return [];
    return data.data.filter((p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data?.data, searchTerm]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-red-500">Error: {error.message}</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" /> Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Product Management</h1>
        <Button onClick={() => setShowCreateDialog(true)}>
          <UserPlus className="h-4 w-4 mr-2" /> Add Product
        </Button>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by product name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No products</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Photo</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((prod) => (
                  <TableRow key={prod._id}>
                    <TableCell className="font-medium">{prod.name}</TableCell>
                    <TableCell>{prod.description}</TableCell>
                    <TableCell>₹{prod.price}</TableCell>
                    <TableCell>
                      <img
                        src={prod.photo}
                        alt={prod.name}
                        className="h-10 w-10 rounded object-cover"
                      />
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProductView(prod)} // 👈 naya state variable
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProduct(prod)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeleteProductId(prod._id)}
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

      {/* Create Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>Fill product details.</DialogDescription>
          </DialogHeader>
          <ProductForm
            onSubmit={(formData) => createProductMutation.mutate(formData)}
            onCancel={() => setShowCreateDialog(false)}
            loading={createProductMutation.isLoading}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={!!selectedProduct}
        onOpenChange={() => setSelectedProduct(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update product details.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <ProductForm
              initialData={selectedProduct}
              isEdit
              onSubmit={(formData) =>
                updateProductMutation.mutate({
                  productId: selectedProduct._id,
                  formData,
                })
              }
              onCancel={() => setSelectedProduct(null)}
              loading={updateProductMutation.isLoading}
            />
          )}
        </DialogContent>
      </Dialog>
      {/* View Product Dialog */}
      <Dialog
        open={!!selectedProductView}
        onOpenChange={() => setSelectedProductView(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {selectedProductView?.name}
            </DialogTitle>
            <DialogDescription>Product Details</DialogDescription>
          </DialogHeader>

          {selectedProductView && (
            <div className="space-y-6">
              {/* Image */}
              <div className="flex justify-center">
                <img
                  src={selectedProductView.photo}
                  alt={selectedProductView.name}
                  className="h-48 object-contain rounded-xl border shadow-md"
                />
              </div>

              {/* Basic Info */}
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-lg font-semibold">
                    {selectedProductView.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Price</p>
                  <p className="text-lg font-bold text-green-600">
                    ₹ {selectedProductView.price}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Description
                  </p>
                  <p className="text-gray-700">
                    {selectedProductView.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteProductId}
        onOpenChange={() => setDeleteProductId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure? This product will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteProductMutation.mutate(deleteProductId)}
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

export default Products;
