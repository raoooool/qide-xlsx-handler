import RuleStore from "@/stores/RuleStore";
import { ReactNode, useState } from "react";
import { Button, Drawer, Form, Input, message, Space } from "tdesign-react";
import RuleChooser from "../RuleChooser";
import { v4 } from "uuid";
import dayjs from "dayjs";

export default function (props: { onClose: () => void }) {
  const [choosers, setChoosers] = useState<ReactNode[]>([<RuleChooser />]);
  const [form] = Form.useForm();
  const { setRules, rules: preRules } = RuleStore.useContainer();

  async function onSubmit() {
    const isValidate = await form.validate?.(),
      data = form.getFieldsValue?.(true);
    if (isValidate === true) {
      const { name = "", sheetIndex = "1", ...rules } = data || {};
      setRules([
        ...preRules,
        {
          id: v4(),
          name,
          sheetIndex,
          createdTime: dayjs().format("YYYY-MM-DD HH:mm"),
          rule: Object.values(rules),
        },
      ]);
      message.success("添加成功");
      props.onClose();
    }
  }

  return (
    <Drawer
      visible
      size="large"
      onConfirm={onSubmit}
      onClose={props.onClose}
      onCancel={props.onClose}
    >
      <Form form={form} labelAlign="left" labelWidth={80}>
        <Form.FormItem name="name" label="名称" rules={[{ required: true }]}>
          <Input placeholder="请输入名称" />
        </Form.FormItem>
        <Form.FormItem
          name="sheetIndex"
          label="表序号"
          rules={[{ required: true }]}
          initialData={1}
        >
          <Input placeholder="请输入表序号" type="number" />
        </Form.FormItem>
        <Space align="start" className="mt-4 mb-4">
          <div className="text-lg font-semibold relative bottom-0.5">
            映射规则
          </div>
          <Button size="small">加一条</Button>
        </Space>
        {choosers.map((item, index) => {
          const key = `chooser-${index}`;
          return (
            <Form.FormItem
              key={key}
              name={key}
              rules={[
                { required: true, message: "请输入映射关系" },
                {
                  validator: (v = []) => {
                    return v.every(Boolean);
                  },
                  message: "请输入合法的映射",
                },
              ]}
            >
              {item}
            </Form.FormItem>
          );
        })}
      </Form>
    </Drawer>
  );
}
