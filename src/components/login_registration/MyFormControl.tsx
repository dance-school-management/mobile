import {
  Button,
  ButtonText,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
  Input,
  InputField,
  VStack,
  Text,
  AlertCircleIcon,
} from '@/components/ui';
import { LoginFormData, RegisterFormData } from '@/util/types/types';
import { Dispatch, SetStateAction } from 'react';

type MyFormControlProps<T extends Record<string, any>> = {
  error: string | undefined;
  field: keyof T; // np. 'email', 'password', ...
  fieldValue: string;
  setFormData: Dispatch<SetStateAction<T>>;
  inputType: 'text' | 'password' | undefined;
  label: string;
};

export default function MyFormControl<T extends Record<string, any>>(
  props: MyFormControlProps<T>
) {
  return (
    <FormControl isInvalid={!!props.error} size="md">
      <FormControlLabel>
        <FormControlLabelText>{props.label}</FormControlLabelText>
      </FormControlLabel>
      <Input className="my-1" size="xl">
        <InputField
          type={props.inputType}
          placeholder={props.field.toString()}
          value={props.fieldValue}
          onChangeText={(text) =>
            props.setFormData((cur: any) => ({ ...cur, [props.field]: text }))
          }
        />
      </Input>
      {props.error && (
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText className="text-red-300">
            {props.error}
          </FormControlErrorText>
        </FormControlError>
      )}
    </FormControl>
  );
}
