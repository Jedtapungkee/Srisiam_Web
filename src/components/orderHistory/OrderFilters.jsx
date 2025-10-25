import React from "react";
import { Button } from "../ui/button";
import { 
  Clock, 
  Package, 
  CheckCircle, 
  XCircle,
  Filter
} from "lucide-react";

const OrderFilters = ({ filters, onFilterChange }) => {
  const statusOptions = [
    { value: "all", label: "ทั้งหมด", icon: <Filter className="w-4 h-4" /> },
    { value: "Not Process", label: "รอดำเนินการ", icon: <Clock className="w-4 h-4" /> },
    { value: "Processing", label: "กำลังดำเนินการ", icon: <Package className="w-4 h-4" /> },
    { value: "Completed", label: "สำเร็จ", icon: <CheckCircle className="w-4 h-4" /> },
    { value: "Cancelled", label: "ยกเลิก", icon: <XCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statusOptions.map((option) => (
        <Button
          key={option.value}
          variant={filters.orderStatus === option.value ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange("orderStatus", option.value)}
          className="flex items-center gap-2"
        >
          {option.icon}
          {option.label}
        </Button>
      ))}
    </div>
  );
};

export default OrderFilters;
