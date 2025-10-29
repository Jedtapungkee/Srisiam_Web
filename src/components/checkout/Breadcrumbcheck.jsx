import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const Breadcrumbcheck = () => {
  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex justify-between items-center mb-6 bg-[#c3c5ee] p-4 rounded shadow-sm h-[100px]">
        <Breadcrumb className="flex items-center  space-x-2 ">
          <BreadcrumbItem>
            <BreadcrumbLink href="/">
              <h2 className="font-bold text-3xl">Srisiam</h2>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator className="font-bold" />
          <BreadcrumbItem>
            <BreadcrumbPage>
              <h2 className="text-2xl font-medium">คำสั่งซื้อของคุณ</h2>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </Breadcrumb>
        <div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumbcheck;
