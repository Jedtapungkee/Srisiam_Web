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
  Trash,
  MoreHorizontal,
  Search,
  FolderOpen,
  Package,
  TrendingUp,
  Plus,
} from "lucide-react";
import { removeCategory } from "../../../api/Category";
import Swal from "sweetalert2";
import { toast } from "sonner";
import FormCategory from "./FormCategory";
const TableCategory = () => {
  const getCategory = useSrisiamStore((state) => state.getCategory);
  const categories = useSrisiamStore((state) => state.categories);
  const products = useSrisiamStore((state) => state.products);
  const token = useSrisiamStore((state) => state.token);

  // Loading and search states
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getCategory();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleRemove = async (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `you want to delete category ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeCategory(token, id);
          toast.success(`Delete Category ${name} successfully`);
          getCategory();
        } catch (error) {
          console.log(error);
          toast.error("Failed to delete category");
        }
      }
    });
  };

  // Filter categories based on search term
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const getProductCountByCategory = (categoryId) => {
    return (
      products?.filter((product) => product.categoryId === categoryId).length ||
      0
    );
  };

  // Skeleton loader component
  const CategoryRowSkeleton = () => (
    <TableRow>
      <TableCell>
        <Skeleton className="h-4 w-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-32" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-4 w-16" />
      </TableCell>
      <TableCell className="text-center">
        <Skeleton className="h-8 w-10" />
      </TableCell>
    </TableRow>
  );
  return (
    <TooltipProvider>
      <div className="w-full space-y-6">
        {/* Search and Management Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                จัดการหมวดหมู่สินค้า
              </CardTitle>
              <FormCategory />
            </div>
            <CardDescription>
              ค้นหาและจัดการหมวดหมู่สินค้าของคุณ
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาชื่อหมวดหมู่..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Categories Table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-20">ลำดับ</TableHead>
                    <TableHead className="min-w-[200px]">
                      ชื่อหมวดหมู่
                    </TableHead>
                    <TableHead className="w-32 text-center">
                      จำนวนสินค้า
                    </TableHead>
                    <TableHead className="w-16 text-center">จัดการ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    // Loading skeleton
                    Array.from({ length: 5 }).map((_, index) => (
                      <CategoryRowSkeleton key={index} />
                    ))
                  ) : filteredCategories.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <FolderOpen className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {searchTerm
                              ? "ไม่พบหมวดหมู่ที่ค้นหา"
                              : "ยังไม่มีหมวดหมู่สินค้า"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Category rows
                    filteredCategories.map((item, index) => {
                      const productCount = getProductCountByCategory(item.id);

                      return (
                        <TableRow
                          key={item.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium text-muted-foreground">
                            {index + 1}
                          </TableCell>

                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <FolderOpen className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <p className="font-medium leading-none">
                                  {item.name}
                                </p>
                                <p className="text-sm text-muted-foreground mt-1">
                                  สร้างเมื่อ{" "}
                                  {new Date(item.createdAt).toLocaleDateString(
                                    "th-TH"
                                  )}
                                </p>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-center">
                            <Badge
                              variant={
                                productCount > 0 ? "default" : "secondary"
                              }
                            >
                              {productCount} รายการ
                            </Badge>
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
                                  onClick={() =>
                                    handleRemove(item.id, item.name)
                                  }
                                  className="cursor-pointer text-red-600 focus:text-red-600"
                                >
                                  <Trash className="mr-2 h-4 w-4" />
                                  ลบหมวดหมู่
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
      </div>
    </TooltipProvider>
  );
};

export default TableCategory;
