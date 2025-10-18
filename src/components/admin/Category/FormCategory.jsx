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
} from "../../ui/dialog";
import FormContainer from "../../form/FormContainer";
import {SubmitButton} from "../../form/Buttons";
import FormInput from "../../form/FormInput";
import { Button } from "../../ui/button";
import { toast } from "sonner";
import { createCategory } from "../../../api/Category";
import useSrisiamStore from "../../../store/Srisiam-store";

const FormCategory = () => {
  const [open, setOpen] = useState(false);
  const token = useSrisiamStore((state) => state.token);
  const getCategory = useSrisiamStore((state) => state.getCategory);

  const handleOnSubmit = async(name) => {
    try{
      const res = await createCategory(token,name);
      toast.success(`เพิ่มประเภทสินค้า ${res.data.category.name} เรียบร้อยแล้ว`);
      // console.log(res);
      getCategory();
    }catch(error){
      toast.error("เกิดข้อผิดพลาดในการเพิ่มประเภทสินค้า");
      console.log(error);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className="w-fit">เพิ่มประเภทสินค้า</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <FormContainer onSubmit={handleOnSubmit}>
          <DialogHeader>
            <DialogTitle>เพิ่มประเภทสินค้าใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลประเภทสินค้าใหม่ของคุณที่นี่
            </DialogDescription>
          </DialogHeader>
          <FormInput name="name" label="ชื่อประเภทสินค้า" className="mb-4" placeholder="กรอกชื่อประเภทสินค้า" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
            <SubmitButton className="ml-2" text="เพิ่มประเภทสินค้า" />
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default FormCategory;