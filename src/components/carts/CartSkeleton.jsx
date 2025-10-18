import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ListCheck } from "lucide-react";

const CartSkeleton = () => {
  // สร้าง skeleton rows หลายๆ แถว
  const skeletonRows = Array.from({ length: 3 }, (_, index) => (
    <TableRow key={index}>
      <TableCell className="text-center">
        <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="w-16 h-16 bg-gray-300 rounded-lg animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="h-3 bg-gray-300 rounded w-16 animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-300 rounded w-16 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-300 rounded-md animate-pulse"></div>
          <div className="w-8 h-6 bg-gray-300 rounded animate-pulse"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-md animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
      </TableCell>
      <TableCell>
        <div className="w-5 h-5 bg-gray-300 rounded animate-pulse"></div>
      </TableCell>
    </TableRow>
  ));

  return (
    <div>
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center mb-6 bg-[#c3c5ee] p-4 rounded shadow-sm h-[100px]">
        <div className="flex items-center space-x-2">
          <div className="h-8 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-4 animate-pulse"></div>
          <div className="h-6 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      {/* Header Skeleton */}
      <div className="flex items-center gap-2 mb-4">
        <ListCheck size={26} className="text-gray-300" />
        <div className="h-6 bg-gray-300 rounded w-48 animate-pulse"></div>
      </div>

      {/* Table Skeleton */}
      <div>
        <Table className="shadow-sm bg-gray-100 rounded-md">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24"></TableHead>
              <TableHead>รูปสินค้า</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>ราคาต่อชิ้น</TableHead>
              <TableHead>จำนวน</TableHead>
              <TableHead>ราคารวม</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{skeletonRows}</TableBody>
        </Table>
      </div>

      {/* Bottom Section Skeleton */}
      <div className="flex justify-between items-center space-x-2 mt-8 pl-10 bg-gray-100 p-8 rounded-md shadow-sm">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-4 bg-gray-300 rounded w-20 animate-pulse"></div>
          <div className="h-8 bg-gray-300 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-300 rounded w-28 animate-pulse"></div>
          <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default CartSkeleton;