import {
  Component,
  createContext,
  createEffect,
  createResource,
  createSignal,
  JSX,
  onMount,
  Resource,
  ResourceFetcher,
  useContext,
} from "solid-js";
import Cookies from "js-cookie";
import { apiRoutes } from "~/utils/routes";
import { DataResponse, Staff, StaffStatus } from "~/types";
import axios from "axios";
import getEndPoint from "~/utils/getEndPoint";
import { toastSuccess } from "~/utils/toast";
import handleFetchError from "~/utils/handleFetchError";

export const apiInstance = axios.create({
  baseURL: getEndPoint(),
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

      if (
        data.content === undefined ||
        data.content.status === StaffStatus.DISABLED
      ) {
        clearItem("token");
        setApiAuthorization("");
        return undefined;
      }

      toastSuccess("Authorization succeeded");
      return data.content;
    }
    return undefined;
  } catch (error) {
    handleFetchError(error);
    clearItem("token");
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
  const [ isClient, setIsClient ] = createSignal(false);

  const [ user, { mutate, refetch } ] = createResource(isClient, fetchData);

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
