import React from "react";
import { useController, useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

const FormSelect = ({ name, label, options = [], className = "", placeholder = "เลือก...", required = false, defaultValue, ...props }) => {
  const { control } = useFormContext();
  
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: defaultValue || "",
    rules: {
      required: required ? `${label} จำเป็นต้องเลือก` : false,
    },
  });

//   console.log("FormSelect options:", options);
//   console.log("FormSelect value:", value);

  return (
    <div className={className}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      <Select value={value || ""} onValueChange={onChange}>
        <SelectTrigger className="w-full" {...props}>
            <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
            <SelectGroup>
                <SelectLabel>{label}</SelectLabel>
                {
                    options.map((item, index) => (
                        <SelectItem key={index} value={String(item.id)}>{item.name}</SelectItem>
                    ))
                }
            </SelectGroup>
        </SelectContent>
      </Select>
      {error && (
        <p className="text-sm text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );
};

export default FormSelect;
