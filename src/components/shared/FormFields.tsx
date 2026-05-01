import * as React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { type FieldError } from "react-hook-form";

interface BaseFieldProps {
  label: string;
  error?: FieldError;
}

interface FormInputProps extends React.ComponentProps<typeof Input>, BaseFieldProps {}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <FormItem>
        <FormLabel error={!!error}>{label}</FormLabel>
        <FormControl>
          <Input ref={ref} {...props} />
        </FormControl>
        <FormMessage>{error?.message}</FormMessage>
      </FormItem>
    );
  }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends React.ComponentProps<typeof Textarea>, BaseFieldProps {}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <FormItem>
        <FormLabel error={!!error}>{label}</FormLabel>
        <FormControl>
          <Textarea ref={ref} {...props} />
        </FormControl>
        <FormMessage>{error?.message}</FormMessage>
      </FormItem>
    );
  }
);
FormTextarea.displayName = "FormTextarea";
