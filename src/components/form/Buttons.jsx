import React from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
export const SubmitButton = ({ className, size, text }) => {
  const { formState } = useForm();
  return (
    <Button type="submit" className={`${className} capitalize`} size={size} disabled={formState.isSubmitting}>
      {formState.isSubmitting ? <LoaderCircle className="animate-spin" /> : <p>{text}</p>}
    </Button>
  );
};

export const OpenDialogButton = ({ className, text }) => {
  return(
    <Button type="button" className={`${className} capitalize`} variant="outline">{text}</Button>
  )
}