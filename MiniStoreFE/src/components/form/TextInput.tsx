import { Component, JSX, Show, splitProps } from "solid-js";
import { Field, FieldProps } from "solid-form-handler";

export type TextInputProps = JSX.InputHTMLAttributes<HTMLInputElement> &
  FieldProps & { label?: string };

export const TextInput: Component<TextInputProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "classList",
    "label",
    "formHandler",
  ]);

  return (
    <Field
      {...props}
      mode="input"
      render={(field) => (
        <div classList={local.classList}>
          <Show when={local.label}>
            <label for={field.props.id} class="inline-block mb-2 text-gray-600">
              {local.label}
            </label>
          </Show>

          <input
            {...rest}
            {...field.props}
            classList={{
              "ring-1 ring-red-400 focus:outline-none": field.helpers.error,
              "w-full px-4 py-2 text-gray-600 border rounded outline-none focus:border-indigo-500 focus:shadow":
                true,
            }}
          />

          <Show when={field.helpers.error}>
            <p class="text-sm text-red-400">{field.helpers.errorMessage}</p>
          </Show>
        </div>
      )}
    />
  );
};
