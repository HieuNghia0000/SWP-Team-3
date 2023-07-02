import { Setter, Resource } from "solid-js";
import { ShiftTemplate } from "~/types";

export interface TemplateProps {
  setState: Setter<"list" | "edit" | "create">;
  shiftTemplates: Resource<ShiftTemplate[]>;
}
