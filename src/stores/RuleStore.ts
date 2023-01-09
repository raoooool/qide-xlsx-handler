import { Rule } from "@/types";
import { getFile } from "@/utils";
import { useLocalStorageState } from "ahooks";
import { useCallback } from "react";
import { createContainer } from "unstated-next";

export const LOCATION_STORAGE_KEY = "__RULE_STORE__";

export default createContainer(function () {
  const [rules, setRules] = useLocalStorageState<Rule[]>(LOCATION_STORAGE_KEY, {
    defaultValue: [],
  });

  const exportRules = useCallback(() => {
    const blob = new Blob([JSON.stringify({ rules }, undefined, 2)], {
        type: "text/json",
      }),
      a = document.createElement("a");

    a.download = "表格映射小助手的规则们.json";
    a.href = window.URL.createObjectURL(blob);
    a.dataset.downloadurl = ["text/json", a.download, a.href].join(":");
    a.click();
  }, [rules]);

  const loadRules = useCallback(async () => {
    const file = await getFile();
    const data = JSON.parse((await file?.text()) || "{}") as any;
    if (!data?.rules) {
      return Promise.reject(new Error("json 读取错误"));
    }
    setRules([...rules, ...data.rules]);
  }, [rules]);

  return {
    rules,
    setRules,
    exportRules,
    loadRules,
  };
});
