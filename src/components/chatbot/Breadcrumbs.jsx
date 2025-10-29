import React from "react";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";

const Breadcrumbs = () => {
  return (
    <div className="flex items-center mb-6 bg-[#c3c5ee] p-4 rounded shadow-sm h-[100px]">
      <Breadcrumb className="flex items-center space-x-2 ">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">
            <h2 className="font-bold text-3xl">Srisiam</h2>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="font-bold" />
        <BreadcrumbItem>
          <BreadcrumbPage>
            <h2 className="text-2xl font-medium">แชท</h2>
          </BreadcrumbPage>
        </BreadcrumbItem>
      </Breadcrumb>
    </div>
  );
};

export default Breadcrumbs;
