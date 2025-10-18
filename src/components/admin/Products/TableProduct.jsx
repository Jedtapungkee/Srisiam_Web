import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../ui/card";
import { Badge } from "../../ui/badge";
import { Skeleton } from "../../ui/skeleton";
import { Input } from "../../ui/input";
import { Button } from "../../ui/button";
import useSrisiamStore from "../../../store/Srisiam-store";
import {
  Edit2,
  Trash,
  MoreHorizontal,
  Search,
  Package,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Filter,
} from "lucide-react";
import { deleteProduct } from "../../../api/Product";
import Swal from "sweetalert2";
import { toast } from "sonner";
import FormEditProduct from "./FormEditProduct";
import FormProduct from "./FormProduct";
import { formatSizeForDisplay } from "../../../utils/product";
const TableProduct = () => {
  const getProduct = useSrisiamStore((state) => state.getProduct);
  const products = useSrisiamStore((state) => state.products);
  const token = useSrisiamStore((state) => state.token);

  // State to track selected size for each product
  const [selectedSizes, setSelectedSizes] = useState({});

  // State for edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Loading and filter states
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // console.log(products);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getProduct();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  // Initialize selected sizes when products load
  useEffect(() => {
    if (products.length > 0) {
      const initialSizes = {};
      products.forEach((product) => {
        if (product.productsizes && product.productsizes.length > 0) {
          initialSizes[product.id] = product.productsizes[0].size;
        }
      });
      setSelectedSizes(initialSizes);
    }
  }, [products]);

  const handleSizeChange = (productId, size) => {
    setSelectedSizes((prev) => ({
      ...prev,
      [productId]: size,
    }));
  };

  const getSelectedSizeData = (product) => {
    const selectedSize = selectedSizes[product.id];
    const sizeData = product.productsizes?.find(
      (ps) => ps.size === selectedSize
    );
    return (
      sizeData ||
      product.productsizes?.[0] || { price: 0, quantity: 0, sold: 0 }
    );
  };



  const handleRemove = async (id, title) => {
    Swal.fire({
      title: "Are you sure?",
      text: `you want to delete product ${title}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await deleteProduct(token, id);
          toast.success(`Delete Product ${title} successfully`);
          getProduct();
        } catch (error) {
          console.log(error);
          toast.error("Failed to delete product");
        }
      }
    });
  };

  const handleEdit = (productId) => {
    setEditProductId(productId);
    setEditModalOpen(true);
    // console.log("Edit product ID:", productId);
  };

  // Filter products based on search term and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category?.name === selectedCategory;
    return matchesSearch && matchesCategory;
  });



  // Get unique categories for filter
  const categories = [  
    "all",
    ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
  ];

  // Skeleton loader component
  const ProductRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="w-16 h-16 rounded-md" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-20" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-10" />
      </TableCell>
    </TableRow>
  );
  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Search and Filter Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                จัดการสินค้า
              </CardTitle>
              <FormProduct />
            </div>
            <CardDescription>ค้นหาและจัดการข้อมูลสินค้าของคุณ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาชื่อสินค้า..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger>
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="เลือกหมวดหมู่" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "ทั้งหมด" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-20">รูปภาพ</TableHead>
                    <TableHead className="min-w-[200px]">ชื่อสินค้า</TableHead>
                    <TableHead className="w-24 text-center">ไซส์</TableHead>
                    <TableHead className="w-24 text-center">ราคา</TableHead>
                    <TableHead className="w-20 text-center">คงเหลือ</TableHead>
                    <TableHead className="w-20 text-center">ขายแล้ว</TableHead>
                    <TableHead className="w-16 text-center">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <ProductRowSkeleton key={index} />
                    ))
                  ) : filteredProducts.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <Package className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            ไม่พบสินค้าที่ค้นหา
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Product rows
                    filteredProducts.map((item) => {
                      // console.log(item);
                      const sizeData = getSelectedSizeData(item);
                      // console.log(sizeData);
                      const isLowStock = sizeData.quantity <= 10;

                      return (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell>
                            <div className="relative">
                              {item.images.length > 0 ? (
                                <img
                                  src={item.images[0].url}
                                  alt={item.title}
                                  className="w-16 h-16 object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                                />
                              ) : (
                                <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center">
                                  <Package className="h-6 w-6 text-muted-foreground" />
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium leading-none">
                                {item.title}
                              </p>
                              {item.category && (
                                <Badge variant="secondary" className="text-xs">
                                  {item.category.name}
                                </Badge>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            {item.productsizes &&
                            item.productsizes.length > 0 ? (
                              <Select
                                value={selectedSizes[item.id] || ""}
                                onValueChange={(value) =>
                                  handleSizeChange(item.id, value)
                                }
                              >
                                <SelectTrigger className="w-20 h-8">
                                  <SelectValue>
                                    {selectedSizes[item.id]
                                      ? formatSizeForDisplay(
                                          selectedSizes[item.id]
                                        )
                                      : "Size"}
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {item.productsizes.map((size) => (
                                    <SelectItem key={size.id} value={size.size}>
                                      {formatSizeForDisplay(size.size)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            ) : (
                              <Badge variant="outline">ไม่มีไซส์</Badge>
                            )}
                          </TableCell>

                          <TableCell className="text-center font-medium">
                            ฿{sizeData.price?.toLocaleString() || 0}
                          </TableCell>

                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              <span
                                className={`font-medium ${
                                  isLowStock ? "text-orange-600" : ""
                                }`}
                              >
                                {sizeData.quantity || 0}
                              </span>
                              {isLowStock && (
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AlertCircle className="ml-1 h-3 w-3 text-orange-600" />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>สต๊อกต่ำ</p>
                                  </TooltipContent>
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="text-center font-medium text-green-600">
                            {sizeData.sold || 0}
                          </TableCell>

                          <TableCell className="text-center">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">เปิดเมนู</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleEdit(item.id)}
                                  className="cursor-pointer"
                                >
                                  <Edit2 className="mr-2 h-4 w-4" />
                                  แก้ไข
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() =>
                                    handleRemove(item.id, item.title)
                                  }
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  ลบ
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Edit Product Modal */}
        <FormEditProduct
          productId={editProductId}
          open={editModalOpen}
          setOpen={setEditModalOpen}
        />
      </div>
    </TooltipProvider>
  );
};

export default TableProduct;
