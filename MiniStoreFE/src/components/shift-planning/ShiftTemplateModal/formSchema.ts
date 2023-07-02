import { Role } from "~/types";
import { timeOptions } from "../utils/timeOptions";
import * as yup from "yup";

type ShiftTemplateForm = {
  name: string;
  startTime: string;
  endTime: string;
  role: Role | "All roles";
  salaryCoefficient: number;
};

const validTimeOptions = timeOptions().map((item) => item.value);

export const schema: yup.Schema<ShiftTemplateForm> = yup.object({
  name: yup.string().required("Please enter a shift name"),
  startTime: yup
    .string()
    .oneOf(validTimeOptions, "Invalid time options")
    .required("Please select a start time"),
  endTime: yup
    .string()
    .oneOf(validTimeOptions, "Invalid time options")
    .required("Please select a end time"),
  role: yup
    .string()
    .oneOf(
      [Role.MANAGER, Role.CASHIER, Role.GUARD, "All roles"],
      "Invalid role"
    )
    .required("Please select a role"),
  salaryCoefficient: yup
    .number()
    .min(1, "Coefficient can not below 1")
    .required("Please select a coefficient"),
});
