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
import { createEducationLevel } from "../../../api/EducationLevel";
import useSrisiamStore from "../../../store/Srisiam-store";

const FormEducation = () => {
  const [open, setOpen] = useState(false);
  const token = useSrisiamStore((state) => state.token);
  const getEducationLevel = useSrisiamStore((state) => state.getEducationLevel);

  const handleOnSubmit = async(name) => {
    try{
      const res = await createEducationLevel(token,name);
      toast.success(`เพิ่มระดับการศึกษา ${res.data.educationLevel.name} เรียบร้อยแล้ว`);
      // console.log(res);
      getEducationLevel();
    }catch(error){
      toast.error("เกิดข้อผิดพลาดในการเพิ่มระดับการศึกษา");
      console.log(error);
    }
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button  className="w-fit">เพิ่มระดับการศึกษา</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <FormContainer onSubmit={handleOnSubmit}>
          <DialogHeader>
            <DialogTitle>เพิ่มระดับการศึกษาใหม่</DialogTitle>
            <DialogDescription>
              กรอกข้อมูลระดับการศึกษาใหม่ของคุณที่นี่
            </DialogDescription>
          </DialogHeader>
          <FormInput name="name" label="ชื่อระดับการศึกษา" className="mb-4" placeholder="กรอกชื่อระดับการศึกษา" />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">ยกเลิก</Button>
            </DialogClose>
            <SubmitButton className="ml-2" text="เพิ่มระดับการศึกษา" />
          </DialogFooter>
        </FormContainer>
      </DialogContent>
    </Dialog>
  );
};

export default FormEducation;