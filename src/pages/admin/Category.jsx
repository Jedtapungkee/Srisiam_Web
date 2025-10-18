import FormEducation from "../../components/admin/EducationLevel/FormEducation";
import FormCategory from "../../components/admin/Category/FormCategory";
import TableCategory from "../../components/admin/Category/TableCategory";
import React from "react";
import TableEducation from "../../components/admin/EducationLevel/TableEducation";

const Category = () => {
  return (
    <>
      <div className="space-y-4">
        <TableCategory />
        <TableEducation />
      </div>
    </>
  );
};

export default Category;
