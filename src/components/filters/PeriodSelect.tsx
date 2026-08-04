import { SingleSelect } from "./SingleSelect";
import type { FilterOption } from "../../domain/types";

type PeriodSelectProps = {
  id: string;
  label: string;
  options: FilterOption[];
  value: string | undefined;
  onChange: (value: string | undefined) => void;
};

export function PeriodSelect(props: PeriodSelectProps) {
  return <SingleSelect {...props} />;
}
