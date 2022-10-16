import { Button, InputValue, Space, Textarea } from "tdesign-react";

export default function (props: {
  onChange?: (v: string[]) => void;
  onDelete: () => void;
  onCopy: () => void;
  value?: string[];
}) {
  const { value = [] } = props;

  const onChange =
    (type: "start" | "end") =>
    (v: InputValue = "") => {
      switch (type) {
        case "end":
          props.onChange?.([value[0], v.toString()]);
          break;

        case "start":
        default:
          props.onChange?.([v.toString(), value[1]]);
          break;
      }
    };

  return (
    <Space align="center">
      <Textarea
        value={value[0]}
        onChange={onChange("start")}
        placeholder="请输入列号，如 B"
      />
      <div>➡️</div>
      <Textarea
        value={value[1]}
        onChange={onChange("end")}
        placeholder="请输入单元格，如 D；高级映射使用英文分号隔开"
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
