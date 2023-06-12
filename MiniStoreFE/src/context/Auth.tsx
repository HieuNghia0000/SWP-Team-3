import {
  Component,
  JSX,
  Resource,
  ResourceFetcher,
  createContext,
  createEffect,
  createResource,
  createSignal,
  onMount,
  useContext,
} from "solid-js";
import Cookies from "js-cookie";
import { apiRoutes } from "~/utils/routes";
import { Staff } from "~/types";
import axios, { isAxiosError } from "axios";

export const apiInstance = axios.create({
  baseURL: Cookies.get("endpoint"),
});

const addItem = (key: string, value = "") => {
  /**
   *  Using the local storage code....
   */
  // if (key) localStorage.setItem(key, value);

  /**
   *  Using the Cookies code...
   */
  if (key) Cookies.set(key, value, { expires: 1 });
};

const clearItem = (key: string) => {
  /**
   *  Using the local storage code....
   */
  // localStorage.removeItem(key);

  /**
   *  Using the Cookies code...
   */
  Cookies.remove(key);
};

const isTokenExists = () => {
  /**
   *  Using the local storage code....
   */
  // const token = localStorage.getItem('token');

  /**
   *  Using the Cookies code...
   */
  const token = Cookies.get("token");

  // JWT decode & check token validity & expiration.
  if (token) {
    setApiAuthorization(token);
    return true;
  }
  return false;
};

const setApiAuthorization = (token: string) => {
  apiInstance.defaults.headers.common["Authorization"] = "Bearer " + token;
};

interface DataResponse<T> extends Response {
  content: T;
  errors: string[] | string;
  timestamp: string;
  status: number;
}

const fetchData: ResourceFetcher<
  boolean,
  Staff | undefined,
  { username: string; password: string }
> = async (source, { refetching }) => {
  try {
    // run when login form is submitted
    if (typeof refetching === "object") {
      const { data } = await apiInstance.post<DataResponse<string>>(
        apiRoutes.login,
        {
          username: refetching.username,
          password: refetching.password,
        }
      );
      if (data.content !== undefined) {
        addItem("token", data.content);
        setApiAuthorization(data.content);
      }
    }

    // get current user data by token
    if (isTokenExists()) {
      const { data } = await apiInstance.get<DataResponse<Staff>>(
        apiRoutes.currentUser
      );

      return data.content;
    }
    return undefined;
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        // console.log(error.response.data);
        // console.log(error.response.status);
        // console.log(error.response.headers);
        if (typeof error.response.data.errors === "string")
          throw new Error(error.response.data.errors as string);
        else {
          throw new Error(error.response.data.errors[0] as string);
        }
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
        throw new Error("No response from server");
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log("Error", error.message);
        throw new Error("Something went wrong. Please try again");
      }
      // console.log(error.config);
    }
  }
};

type AuthContextType = {
  user: Resource<Staff | undefined>;
  logOut: () => void;
  logIn: (username: string, password: string) => void;
};

export const AuthContext = createContext<AuthContextType>();

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider: Component<AuthProviderProps> = (props) => {
  const [isClient, setIsClient] = createSignal(false);

  const [user, { mutate, refetch }] = createResource(isClient, fetchData);

  onMount(() => {
    setIsClient(true);
  });

  createEffect(() => {
    // remember to check if error is existed before using the data resource. If not, it will throw error out in the UI
    if (user.error) {
      console.log("user.error", user.error);
      clearItem("token");
    } else if (user()) {
      console.log("user", user());
    }
  });

  const logOut = () => {
    mutate(undefined);
    clearItem("token");
  };

  const logIn = (username: string, password: string) => {
    refetch({ username, password });
  };

  return (
    <AuthContext.Provider value={{ user, logOut, logIn }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  return useContext(AuthContext)!;
}
