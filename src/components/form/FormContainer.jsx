import React from "react";
import { useForm, FormProvider } from "react-hook-form";

const FormContainer = ({ onSubmit, children , className, defaultValues }) => {
  const methods = useForm({
    defaultValues: defaultValues || {}
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  );
};

export default FormContainer;
