import { ReactNode } from "react";
import "tdesign-react/esm/style/index.js";
import RuleStore from "./stores/RuleStore";
import "./theme.css";

export function rootContainer(container: ReactNode) {
  return <RuleStore.Provider>{container}</RuleStore.Provider>;
}
