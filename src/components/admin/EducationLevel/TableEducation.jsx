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
  GraduationCap,
  BookOpen,
  Package,
} from "lucide-react";
import { removeEducationLevel } from "../../../api/EducationLevel";
import Swal from "sweetalert2";
import { toast } from "sonner";
import FormEducation from "./FormEducation";
const TableEducation = () => {
  const getEducationLevel = useSrisiamStore((state) => state.getEducationLevel);
  const educationLevels = useSrisiamStore((state) => state.educationLevels);
  const products = useSrisiamStore((state) => state.products);
  const token = useSrisiamStore((state) => state.token);

  // Loading and search states
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getEducationLevel();
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleRemove = async (id, name) => {
    Swal.fire({
      title: "Are you sure?",
      text: `you want to delete education level ${name}?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await removeEducationLevel(token, id);
          toast.success(`Delete Education Level ${name} successfully`);
          getEducationLevel();
        } catch (error) {
          console.log(error);
          toast.error("Failed to delete Education Level");
        }
      }
    });
  };

  // Filter education levels based on search term
  const filteredEducationLevels = educationLevels.filter((level) =>
    level.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get product count by education level (if products data is available)
  const getProductCountByEducationLevel = (levelId) => {
    return (
      products?.filter((product) => product.educationLevelId === levelId)
        .length || 0
    );
  };

  // Skeleton loader component
  const EducationRowSkeleton = () => (
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
        {/* Header and Search Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                จัดการระดับการศึกษา
              </CardTitle>
              <FormEducation />
            </div>
            <CardDescription>
              ค้นหาและจัดการข้อมูลระดับการศึกษาสำหรับสินค้า
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="ค้นหาระดับการศึกษา..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Education Levels Table */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-20">ลำดับ</TableHead>
                    <TableHead className="min-w-[200px]">
                      ระดับการศึกษา
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
                      <EducationRowSkeleton key={index} />
                    ))
                  ) : filteredEducationLevels.length === 0 ? (
                    // Empty state
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-8">
                        <div className="flex flex-col items-center space-y-2">
                          <GraduationCap className="h-8 w-8 text-muted-foreground" />
                          <p className="text-muted-foreground">
                            {searchTerm
                              ? "ไม่พบระดับการศึกษาที่ค้นหา"
                              : "ยังไม่มีข้อมูลระดับการศึกษา"}
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    // Education level rows
                    filteredEducationLevels.map((item, index) => {
                      const productCount = getProductCountByEducationLevel(
                        item.id
                      );

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
                              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-5 w-5 text-white" />
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
                              className="gap-1"
                            >
                              <Package className="h-3 w-3" />
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
                                  ลบระดับการศึกษา
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

export default TableEducation;
