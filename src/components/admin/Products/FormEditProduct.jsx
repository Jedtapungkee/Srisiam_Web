import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import { Button } from "../../ui/button";
import FormContainer from "../../form/FormContainer";
import FormInput from "../../form/FormInput";
import FormSelect from "../../form/FormSelect";
import { SubmitButton } from "../../form/Buttons";
import { updateProduct, readProduct } from "../../../api/Product";
import useSrisiamStore from "../../../store/Srisiam-store";
import Uploadfile from "../../form/UploadFile";
import { toast } from "sonner";

const FormEditProduct = ({ productId, open, setOpen }) => {
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
  const [productData, setProductData] = useState({
    title: "",
    description: "",
    categoryId: "",
    gender: "",
    educationLevelId: "",
  });
  const [loading, setLoading] = useState(true);

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

  // โหลดข้อมูลสินค้าเมื่อเปิด modal
  useEffect(() => {
    if (open && productId) {
      loadProductData();
    }
  }, [open, productId, token]);

  const loadProductData = async () => {
    try {
      setLoading(true);
      const response = await readProduct(productId);
      const product = response.data;

      setProductData({
        title: product.title || "",
        description: product.description || "",
        categoryId: product.categoryId?.toString() || "",
        gender: product.gender || "",
        educationLevelId: product.educationLevelId?.toString() || "",
      });

      // Set product sizes
      if (product.productsizes && product.productsizes.length > 0) {
        const formattedSizes = product.productsizes.map((ps) => ({
          size: ps.size || "",
          price: ps.price || "",
          quantity: ps.quantity || "",
        }));
        setProductSizes(formattedSizes);
      }

      // Set images
      if (product.images && product.images.length > 0) {
        // Keep full image objects for existing images
        setImages(
          product.images.filter(
            (img) => img.asset_id && img.public_id && img.url && img.secure_url
          )
        );
      } else {
        setImages([]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error loading product data:", error);
      toast.error("ไม่สามารถโหลดข้อมูลสินค้าได้");
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      // Filter out any invalid images
      const validImages = images.filter((img) => {
        // Check if it's a new uploaded image (string) or existing image (object)
        if (typeof img === "string") {
          return img && img.trim() !== "";
        }
        return (
          img && img.asset_id && img.public_id && img.url && img.secure_url
        );
      });

      const formData = {
        ...data,
        categoryId: parseInt(data.categoryId),
        educationLevelId: parseInt(data.educationLevelId),
        productsizes: productSizes,
        images: validImages,
      };

      // console.log("Sending update data:", formData);
      const res = await updateProduct(token, productId, formData);
      toast.success(`แก้ไขสินค้า ${res.data.title} เรียบร้อยแล้ว`);

      // อัพเดทข้อมูลในตาราง
      getProduct();

      // ปิด modal
      setOpen(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("เกิดข้อผิดพลาดในการแก้ไขสินค้า กรุณาลองใหม่อีกครั้ง");
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

  const handleClose = () => {
    setOpen(false);
    // Reset form when closing
    setProductData({
      title: "",
      description: "",
      categoryId: "",
      gender: "",
      educationLevelId: "",
    });
    setProductSizes([{ size: "", price: "", quantity: "" }]);
    setImages([]);
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl">
          <div className="flex justify-center items-center h-32">
            <div className="text-lg">กำลังโหลดข้อมูล...</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="!max-w-[800px] !max-h-[90vh] !h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader className="flex-shrink-0 pb-4">
          <DialogTitle>แก้ไขข้อมูลสินค้า</DialogTitle>
          <DialogDescription>แก้ไขข้อมูลสินค้าของคุณที่นี่</DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <FormContainer
            key={productId}
            onSubmit={handleSubmit}
            defaultValues={productData}
          >
            <div className="space-y-4 pb-4">
              {/* Basic Product Information */}
              <div className="flex flex-col gap-4 flex-1">
                <FormInput
                  name="title"
                  label="ชื่อสินค้า"
                  className="mb-4"
                  placeholder="กรอกชื่อสินค้า"
                  defaultValue={productData.title}
                  required
                />

                <FormInput
                  name="description"
                  label="รายละเอียดสินค้า"
                  className="mb-4"
                  placeholder="กรอกรายละเอียดสินค้า"
                  defaultValue={productData.description}
                  required
                />
              </div>
            </div>

            <div className="flex justify-between w-full gap-2">
              {/* Category Selection */}
              <FormSelect
                name="categoryId"
                label="หมวดหมู่สินค้า"
                options={categories}
                className="mb-4"
                placeholder="เลือกหมวดหมู่สินค้า"
                defaultValue={productData.categoryId}
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
                className="mb-4"
                placeholder="เลือกเพศ"
                defaultValue={productData.gender}
                required
              />

              {/* Education Level Selection */}
              <FormSelect
                name="educationLevelId"
                label="ระดับการศึกษา"
                options={educationLevels}
                className="mb-4"
                placeholder="เลือกระดับการศึกษา"
                defaultValue={productData.educationLevelId}
                required
              />
            </div>

            {/* Product Sizes Section */}
            <div className="mb-4">
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
            <div className="mb-4">
              <label className="block text-sm font-medium">รูปภาพสินค้า</label>
              <Uploadfile
                form={{ images: images }}
                setForm={(newForm) => setImages(newForm.images)}
              />
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" onClick={handleClose}>
                  ยกเลิก
                </Button>
              </DialogClose>
              <SubmitButton className="ml-2" text="บันทึกการแก้ไข" />
            </DialogFooter>
          </FormContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FormEditProduct;
