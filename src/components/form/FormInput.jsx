import React from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";


const FormInput = ({ name, label, type = "text", placeholder, defaultValue,className }) => {
  const { register } = useFormContext();

  return (
    <div>
      <Label htmlFor={name} className="mb-2 capitalize font-bold mt-2">{label}</Label>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={className}
        {...register(name)}
      />
    </div>
  );
};

export default FormInput;
