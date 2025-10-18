import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import { SubmitButton } from "../form/Buttons";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { readAddress, updateAddress } from "../../api/Address";
import { toast } from "sonner";
import useSrisiamStore from "../../store/Srisiam-store";
import { useForm, FormProvider } from "react-hook-form";

const DialogFormEditAddress = ({ open, setOpen, addressId }) => {
  const [isDefault, setIsDefault] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = useSrisiamStore((state) => state.token);
  const getAddresses = useSrisiamStore((state) => state.getAddresses);
  
  const methods = useForm({
    defaultValues: {
      recipientFirstName: "",
      recipientLastName: "",
      phoneNumber: "",
      village: "",
      subDistrict: "",
      district: "",
      province: "",
      zipCode: ""
    }
  });

  useEffect(() => {
    if (open && addressId) {
      fetchAddressData();
    } else {
      // Reset form เมื่อปิด dialog
      methods.reset();
      setIsDefault(false);
    }
  }, [open, addressId]);

  const fetchAddressData = async () => {
    setLoading(true);
    try {
      const response = await readAddress(token, addressId);
      const addressData = response.data.address; // เปลี่ยนจาก response.data เป็น response.data.address
      
      console.log("Address data loaded:", addressData); // Debug
      
      // Reset form ด้วยข้อมูลใหม่
      methods.reset(addressData);
      setIsDefault(addressData.isDefault || false);
    } catch (error) {
      console.error("Error fetching address:", error);
      toast.error("ไม่สามารถโหลดข้อมูลที่อยู่ได้");
    } finally {
      setLoading(false);
    }
  };

  const handleOnSubmit = async (data) => {
    // เพิ่มค่า isDefault เข้าไปใน data object
    const formData = {
      ...data,
      isDefault: isDefault
    };
    
    try {
      await updateAddress(token, addressId, formData);
      toast.success("อัปเดตที่อยู่สำเร็จ");
      setOpen(false);
      getAddresses();
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error("เกิดข้อผิดพลาดในการอัปเดตที่อยู่");
    }
  };

  const handleClose = () => {
    setOpen(false);
    methods.reset();
    setIsDefault(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:!max-w-[600px]">
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="text-lg">กำลังโหลดข้อมูล...</div>
          </div>
        ) : (
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleOnSubmit)}>
              <DialogHeader>
                <DialogTitle>แก้ไขที่อยู่</DialogTitle>
                <DialogDescription>
                  แก้ไขข้อมูลที่อยู่ของคุณที่นี่
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col md:flex-row gap-4">
                <FormInput
                  name="recipientFirstName"
                  label="ชื่อ"
                  className="mb-4"
                  placeholder="กรอกชื่อ"
                />
                <FormInput
                  name="recipientLastName"
                  label="นามสกุล"
                  className="mb-4"
                  placeholder="กรอกนามสกุล"
                />
                <FormInput
                  name="phoneNumber"
                  label="หมายเลขโทรศัพท์"
                  className="mb-4"
                  placeholder="กรอกหมายเลขโทรศัพท์"
                />
              </div>
              <div>
                <FormInput
                  name="village"
                  label="บ้านเลขที่ / หมู่บ้าน"
                  className="mb-4"
                  placeholder="กรอกบ้านเลขที่หรือหมู่บ้าน"
                />
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <FormInput
                  name="subDistrict"
                  label="ตำบล"
                  className="mb-4"
                  placeholder="กรอกตำบล"
                />
                <FormInput
                  name="district"
                  label="อำเภอ"
                  className="mb-4"
                  placeholder="กรอกอำเภอ"
                />
                <FormInput
                  name="province"
                  label="จังหวัด"
                  className="mb-4"
                  placeholder="กรอกจังหวัด"
                />
              </div>
              <div className="flex flex-col justify-between md:flex-row gap-4">
                <FormInput
                  name="zipCode"
                  label="รหัสไปรษณีย์"
                  className="mb-4"
                  placeholder="กรอกรหัสไปรษณีย์"
                />
                <div className="flex items-center mt-2">
                  <Checkbox
                    label="ตั้งเป็นที่อยู่เริ่มต้น"
                    checked={isDefault}
                    onCheckedChange={setIsDefault}
                  />
                  <Label className="ml-2">ตั้งเป็นที่อยู่เริ่มต้น</Label>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleClose}>ยกเลิก</Button>
                </DialogClose>
                <SubmitButton className="ml-2" text="อัปเดตที่อยู่" />
              </DialogFooter>
            </form>
          </FormProvider>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DialogFormEditAddress;