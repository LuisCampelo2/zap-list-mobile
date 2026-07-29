import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form';
import { TextField } from '../ui/TextField';
import type { ComponentProps } from 'react';

type FormTextFieldProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
} & Omit<ComponentProps<typeof TextField>, 'value' | 'onChangeText' | 'error'>;

/** Liga TextField (design system) ao react-hook-form sem repetir o boilerplate de Controller em cada tela. */
export function FormTextField<TFieldValues extends FieldValues>({
  control,
  name,
  ...textFieldProps
}: FormTextFieldProps<TFieldValues>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <TextField
          value={typeof value === 'string' ? value : ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={error?.message}
          {...textFieldProps}
        />
      )}
    />
  );
}
