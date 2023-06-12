import { TextInput } from "~/components/form/TextInput";
import * as yup from "yup";
import { useFormHandler } from "solid-form-handler";
import { yupSchema } from "solid-form-handler/yup";
import { useAuth } from "~/context/Auth";
import { Show } from "solid-js";

type Login = {
  username: string;
  password: string;
};

const schema: yup.Schema<Login> = yup.object({
  username: yup.string().required("Vui lòng nhập tên đăng nhập"),
  password: yup.string().required("Vui lòng nhập mật khẩu"),
});

export default function Login() {
  const { logIn, user } = useAuth();
  const formHandler = useFormHandler(yupSchema(schema), {
    validateOn: ["change"],
  });
  const { formData } = formHandler;

  const submit = async (event: Event) => {
    event.preventDefault();
    try {
      await formHandler.validateForm();
      // alert("Data sent with success: " + JSON.stringify(formData()));

      logIn(formData().username, formData().password);
    } catch (error) {
      console.error(error);
    }
  };

  const reset = () => {
    formHandler.resetForm();
  };

  return (
    <div class="h-screen grid place-items-center">
      <div
        class="bg-white w-full max-w-xs mx-auto p-8 rounded-lg shadow-md"
        x-data="loginForm"
      >
        <h2 class="text-2xl font-bold mb-4 text-center">Log In</h2>
        <Show when={user.error}>
          <p class="text-center text-sm text-red-400">{user.error.message}</p>
        </Show>
        <form class="space-y-4" onSubmit={submit}>
          <div>
            <TextInput
              type="text"
              id="username"
              name="username"
              label="Username"
              placeholder="Enter username"
              formHandler={formHandler}
            />
          </div>
          <div>
            <TextInput
              type="password"
              id="password"
              name="password"
              label="Password"
              placeholder="Enter password"
              formHandler={formHandler}
            />
          </div>
          <div>
            <button
              class="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded focus:shadow-outline w-full"
              type="submit"
            >
              Log In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
