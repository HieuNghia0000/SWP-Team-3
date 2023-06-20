import { Component, JSX, Show, splitProps } from "solid-js";
import { Field, FieldProps } from "solid-form-handler";

export type TextAreaInputProps =
  JSX.TextareaHTMLAttributes<HTMLTextAreaElement> &
    FieldProps & { label?: string };

export const TextArea: Component<TextAreaInputProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "classList",
    "label",
    "formHandler",
    "cols",
    "rows",
  ]);

  return (
    <Field
      {...props}
      mode="input"
      render={(field) => (
        <div classList={local.classList}>
          <Show when={local.label}>
            <label for={field.props.id}>{local.label}</label>
          </Show>

          <textarea
            {...rest}
            {...field.props}
            cols={local.cols}
            rows={local.rows}
            classList={{
              "ring-1 ring-orange-600 focus:outline-none": field.helpers.error,
              "border border-gray-300 py-2 px-4 rounded": true,
              "w-full": !local.cols,
            }}
          />

          <Show when={field.helpers.error}>
            <p class="text-sm text-red-500">{field.helpers.errorMessage}</p>
          </Show>
        </div>
      )}
    />
  );
};
