import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import { SubmitButton } from "../form/Buttons";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { createAddress } from "../../api/Address";
import { toast } from "sonner";
import useSrisiamStore from "../../store/Srisiam-store";
const DialogForm = () => {
  const [open, setOpen] = useState(false);
  const [isDefault, setIsDefault] = useState(false);
  const token = useSrisiamStore((state)=>state.token);
  const getAddresses = useSrisiamStore((state) => state.getAddresses);

  const handleOnSubmit = async (data) => {
    // เพิ่มค่า isDefault เข้าไปใน data object
    const formData = {
      ...data,
      isDefault: isDefault
    };
    try{
        await createAddress(token,formData);
        toast.success("เพิ่มที่อยู่สำเร็จ");
        setOpen(false);
        getAddresses();
    }catch(error){
        console.error("Error creating address:", error);
        toast.error("เกิดข้อผิดพลาดในการเพิ่มที่อยู่");
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen} >
      <DialogTrigger asChild>
        <Button className="w-fit bg-[#00204E]">เพิ่มที่อยู่ใหม่</Button>
      </DialogTrigger>
      <DialogContent className="sm:!max-w-[600px]">
        <FormContainer onSubmit={handleOnSubmit}>
          <DialogHeader>
            <DialogTitle>เพิ่มที่อยู่ใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลที่อยู่ใหม่ของคุณที่นี่
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
          <div className="flex flex-col  justify-between md:flex-row gap-4">
            <FormInput
              name="zipCode"
              label="รหัสไปรษณีย์"
              className="mb-4 "
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
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
            <SubmitButton className="ml-2" text="เพิ่มที่อยู่" />
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
