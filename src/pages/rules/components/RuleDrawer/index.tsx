import RuleStore from "@/stores/RuleStore";
import { useState } from "react";
import { Button, Drawer, Form, Input, message, Space } from "tdesign-react";
import RuleChooser from "../RuleChooser";
import { v4 } from "uuid";
import dayjs from "dayjs";
import { Rule } from "@/types";

type Chooser = {
  key: string;
  initValue: string[];
};

export default function (props: { onClose: () => void; curRule?: Rule }) {
  const [choosers, setChoosers] = useState<Chooser[]>(
    props.curRule?.rules?.map((item) => ({ initValue: item, key: v4() })) || [
      { initValue: [], key: v4() },
    ]
  );
  const [form] = Form.useForm();
  const { setRules, rules: preRules } = RuleStore.useContainer();
  const isEdit = !!props.curRule;

  async function onSubmit() {
    const isValidate = await form.validate?.(),
      data = form.getFieldsValue?.(true);
    if (isValidate !== true) return;
    const { name = "", ...rules } = data || {};
    if (isEdit && props.curRule) {
      props.curRule.name = name;
      props.curRule.modifiedTime = dayjs().format("YYYY-MM-DD HH:mm");
      props.curRule.rules = Object.values(rules);
      setRules([...preRules]);
    } else {
      setRules([
        ...preRules,
        {
          id: v4(),
          name,
          createdTime: dayjs().format("YYYY-MM-DD HH:mm"),
          rules: Object.values(rules),
        },
      ]);
    }
    message.success("操作成功");
    props.onClose();
  }

  function onChooserAdd() {
    setChoosers([...choosers, { initValue: [], key: v4() }]);
  }

  const onChooserDelete = (key: string) => () => {
    setChoosers(choosers.filter((item) => item.key !== key));
  };

  const onChooserCopy = (key: string) => () => {
    const index = choosers.findIndex((item) => item.key === key);
    choosers.splice(index, 0, {
      key: v4(),
      initValue: form.getFieldValue?.(key) as string[],
    });
    setChoosers([...choosers]);
  };

  return (
    <Drawer
      visible
      size="large"
      onConfirm={onSubmit}
      onClose={props.onClose}
      onCancel={props.onClose}
      header={isEdit ? "编辑规则" : "新增规则"}
    >
      <Form form={form} labelAlign="left" labelWidth={80}>
        <Form.FormItem
          name="name"
          label="名称"
          initialData={props.curRule?.name}
          rules={[{ required: true }]}
        >
          <Input placeholder="请输入名称" />
        </Form.FormItem>
        <Space align="start" className="mt-4 mb-4">
          <div className="text-lg font-semibold relative bottom-0.5">
            映射规则
          </div>
          <Button onClick={onChooserAdd} size="small">
            加一条
          </Button>
        </Space>
        {choosers.map((chooser) => {
          return (
            <Form.FormItem
              className="mb-4"
              key={chooser.key}
              name={chooser.key}
              rules={[
                { required: true, message: "请输入映射关系" },
                {
                  validator: (v = []) => {
                    return v.slice(0, 2).every(Boolean);
                  },
                  message: "请输入合法的映射",
                },
              ]}
              initialData={chooser.initValue}
            >
              <RuleChooser
                onCopy={onChooserCopy(chooser.key)}
                onDelete={onChooserDelete(chooser.key)}
              />
            </Form.FormItem>
          );
        })}
      </Form>
    </Drawer>
  );
}
