import { Rule } from "@/types";
import { useLocalStorageState } from "ahooks";
import { createContainer } from "unstated-next";

export const LOCATION_STORAGE_KEY = "__RULE_STORE__";

export default createContainer(function () {
  const [rules, setRules] = useLocalStorageState<Rule[]>(LOCATION_STORAGE_KEY, {
    defaultValue: [],
  });

  return {
    rules,
    setRules,
  };
});
