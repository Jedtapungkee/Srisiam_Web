import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import FormContainer from "../../form/FormContainer";
import FormInput from "../../form/FormInput";
import FormSelect from "../../form/FormSelect";
import { SubmitButton } from "../../form/Buttons";
import { createProduct} from "../../../api/Product";
import useSrisiamStore from "../../../store/Srisiam-store";
import Uploadfile from "../../form/UploadFile";
import { toast } from "sonner";

const FormProduct = () => {
  const [open, setOpen] = useState(false);
  const categories = useSrisiamStore((state) => state.categories);
  const educationLevels = useSrisiamStore((state) => state.educationLevels);
  const getCategory = useSrisiamStore((state) => state.getCategory);
  const getEducationLevel = useSrisiamStore((state) => state.getEducationLevel);
  const getProduct = useSrisiamStore((state) => state.getProduct);
  const [productSizes, setProductSizes] = useState([
    { size: "", price: "", quantity: "" },
  ]);
  const token = useSrisiamStore((state) => state.token);
  const [images, setImages] = useState([]);

  // โหลดข้อมูล categories และ education levels เมื่อ component mount
  useEffect(() => {
    if (categories.length === 0) {
      getCategory();
    }
    if (educationLevels.length === 0) {
      getEducationLevel();
    }
  }, [
    categories.length,
    educationLevels.length,
    getCategory,
    getEducationLevel,
  ]);

  const handleSubmit = async (data) => {
    try {
      const formData = {
        ...data,
        categoryId: parseInt(data.categoryId), // Ensure categoryId is a number
        educationLevelId: parseInt(data.educationLevelId), // Ensure educationLevelId is a number
        productsizes: productSizes,
        images: images,
      };

      const res = await createProduct(token, formData);
      toast.success(`Add Product ${res.data.title} successfully`);
      // console.log("Form data:", formData);

      // Reset form
      setProductSizes([{ size: "", price: "", quantity: "" }]);
      setImages([]);
      setOpen(false);
      getProduct();
    } catch (error) {
      console.error("Error creating product:", error);
      toast.error("Error creating product. Please try again.");
    }
  };

  const addProductSize = () => {
    setProductSizes([...productSizes, { size: "", price: "", quantity: "" }]);
  };

  const removeProductSize = (index) => {
    setProductSizes(productSizes.filter((_, i) => i !== index));
  };

  const updateProductSize = (index, field, value) => {
    const updated = [...productSizes];
    if (field === "size") {
      updated[index][field] = value.toUpperCase();
    } else {
      updated[index][field] = value;
    }
    setProductSizes(updated);
  };


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-fit">เพิ่มสินค้า</Button>
      </DialogTrigger>
      <DialogContent className="!max-w-[800px] !max-h-[90vh] !h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle>เพิ่มสินค้าใหม่</DialogTitle>
          <DialogDescription>กรอกข้อมูลสินค้าที่นี่</DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <FormContainer onSubmit={handleSubmit} className="h-full">
            <div className="space-y-4 pb-4">
              <div className="flex flex-col w-full gap-4">
                {/* Basic Product Information */}
                <FormInput
                  name="title"
                  label="ชื่อสินค้า"
                  placeholder="กรอกชื่อสินค้า"
                  required
                />

                <FormInput
                  name="description"
                  label="รายละเอียดสินค้า"
                  placeholder="กรอกรายละเอียดสินค้า"
                  required
                  className={"w-full "}
                />
              </div>
              
              <div className="flex justify-between w-full gap-2">
                {/* Category Selection */}
                <FormSelect
                  name="categoryId"
                  label="หมวดหมู่สินค้า"
                  options={categories}
                  placeholder="เลือกหมวดหมู่สินค้า"
                  required
                />

                {/* Gender Selection */}
                <FormSelect
                  name="gender"
                  label="เพศ"
                  options={[
                    { id: "MALE", name: "ชาย" },
                    { id: "FEMALE", name: "หญิง" },
                    { id: "UNISEX", name: "ทั้งชายและหญิง" },
                  ]}
                  placeholder="เลือกเพศ"
                  required
                />

                {/* Education Level Selection */}
                <FormSelect
                  name="educationLevelId"
                  label="ระดับการศึกษา"
                  options={educationLevels}
                  placeholder="เลือกระดับการศึกษา"
                  required
                />
              </div>

              {/* Product Sizes Section */}
              <div>
                <h4 className="text-sm font-medium mb-2">ขนาดสินค้าและราคา</h4>
                {productSizes.map((size, index) => (
                  <div key={index} className="flex gap-2 mb-2 items-end">
                    <div className="flex-1">
                      <label className="text-xs">ขนาด</label>
                      <input
                        type="text"
                        placeholder="เช่น S, M, L"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={size.size}
                        onChange={(e) =>
                          updateProductSize(index, "size", e.target.value)
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs">ราคา</label>
                      <input
                        type="number"
                        placeholder="ราคา"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={size.price}
                        onChange={(e) =>
                          updateProductSize(
                            index,
                            "price",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-xs">จำนวน</label>
                      <input
                        type="number"
                        placeholder="จำนวน"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={size.quantity}
                        onChange={(e) =>
                          updateProductSize(
                            index,
                            "quantity",
                            parseInt(e.target.value) || 0
                          )
                        }
                      />
                    </div>
                    {productSizes.length > 1 && (
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProductSize(index)}
                        className="mb-0"
                      >
                        ลบ
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addProductSize}
                  className="mt-2"
                >
                  เพิ่มขนาด
                </Button>
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium">
                  รูปภาพสินค้า
                </label>
                <Uploadfile form={{ images }} setForm={(newForm) => setImages(newForm.images)} />
              </div>

            </div>
            
            <DialogFooter className="flex-shrink-0 mt-6 pt-4 border-t">
              <DialogClose asChild>
                <Button variant="outline">ยกเลิก</Button>
              </DialogClose>
              <SubmitButton className="ml-2" text="เพิ่มสินค้า" />
            </DialogFooter>
          </FormContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormProduct;
