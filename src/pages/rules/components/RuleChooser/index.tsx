import { Button, Input, InputValue, Space } from "tdesign-react";

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
      <Input value={value[0]} onChange={onChange("start")} />
      <div>➡️</div>
      <Input value={value[1]} onChange={onChange("end")} />
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
