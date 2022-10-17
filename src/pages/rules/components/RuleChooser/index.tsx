import { useState } from "react";
import { Button, Input, InputValue, Space, Textarea } from "tdesign-react";

export default function (props: {
  onChange?: (v: string[]) => void;
  onDelete: () => void;
  onCopy: () => void;
  value?: [string, string, string];
}) {
  const { value = [] } = props;

  const onChange =
    (type: "start" | "end" | "senior") =>
    (v: InputValue = "") => {
      switch (type) {
        case "end":
          props.onChange?.([value[0] || "", v.toString(), value[2] || ""]);
          break;
        case "senior":
          props.onChange?.([value[0] || "", value[1] || "", v.toString()]);
          break;
        case "start":
        default:
          props.onChange?.([v.toString(), value[1] || "", value[2] || ""]);
          break;
      }
    };

  return (
    <Space align="center">
      <Textarea
        value={value[0]}
        onChange={onChange("start")}
        placeholder="请输入数据文件的映射列号，如 B"
      />
      <div>➡️</div>
      <Textarea
        value={value[1]}
        onChange={onChange("end")}
        placeholder="请输入模板文件要被映射的单元格，如 D11"
      />
      <div>🧙‍♀️</div>
      <Textarea
        value={value[2]}
        onChange={onChange("senior")}
        placeholder="请输高级映射，非必填，插入变量为 ${pre | post}"
      />
      <Space size="small">
        <Button size="small" onClick={props.onCopy}>
          复制
        </Button>
        <Button size="small" onClick={props.onDelete}>
          删掉
        </Button>
      </Space>
    </Space>
  );
}
