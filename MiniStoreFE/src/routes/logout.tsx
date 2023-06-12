import { useAuth } from "~/context/Auth";

export default function Logout() {
  const { logOut } = useAuth();

  logOut();

  return <></>;
}
