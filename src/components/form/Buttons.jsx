import React from "react";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";

export const SubmitButton = ({ className, size, text, isPending }) => {
  return (
    <Button
      type="submit"
      className={`${className} capitalize`}
      size={size}
      disabled={isPending}
    >
      {isPending ? (
        <>
          <LoaderCircle className="animate-spin" />
          <span>Please wait...</span>
        </>
      ) : (
        <p>{text}</p>
      )}
    </Button>
  );
};
