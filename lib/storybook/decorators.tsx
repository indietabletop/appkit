import { FormProvider, type FormProviderProps } from "@ariakit/react";
import { type Decorator } from "@storybook/react-vite";

export function form(props?: FormProviderProps): Decorator {
  return (Story) => (
    <FormProvider {...props}>
      <Story />
    </FormProvider>
  );
}
