import { Field, FieldProps } from "solid-form-handler";
import {
  Component,
  For,
  JSX,
  Show,
  createEffect,
  createSignal,
  splitProps,
} from "solid-js";

type SelectableOption = { value: string | number; label: string };

export type SelectProps = JSX.SelectHTMLAttributes<HTMLSelectElement> &
  FieldProps & {
    label?: string;
    options?: Array<SelectableOption>;
    placeholder?: string;
  };

export const Select: Component<SelectProps> = (props) => {
  const [local, rest] = splitProps(props, [
    "placeholder",
    "options",
    "label",
    "classList",
    "class",
    "formHandler",
  ]);
  const [options, setOptions] = createSignal<SelectableOption[]>([]);

  /**
   * Computes the select options by using the placeholder and options props.
   */
  createEffect(() => {
    setOptions(() => [
      ...(local.placeholder ? [{ value: 0, label: local.placeholder }] : []),
      ...(local.options || []),
    ]);
  });

  return (
    <Field
      {...props}
      mode="input"
      render={(field) => (
        <div class={local.class} classList={local.classList}>
          <Show when={local.label}>
            <label for={field.props.id} class="inline-block mb-2 text-gray-600">
              {local.label}
            </label>
          </Show>
          <select
            {...rest}
            {...field.props}
            class="w-full border outline-none focus:border-indigo-500 focus:shadow px-4 py-2 rounded truncate"
            classList={{
              "ring-1 ring-red-400 focus:outline-none": field.helpers.error,
            }}
          >
            <For each={options()}>
              {(option) => (
                <option
                  value={option.value}
                  selected={option.value == field.props.value}
                >
                  {option.label}
                </option>
              )}
            </For>
          </select>
          <Show when={field.helpers.error}>
            <p class="text-sm text-red-400">{field.helpers.errorMessage}</p>
          </Show>
        </div>
      )}
    />
  );
};
