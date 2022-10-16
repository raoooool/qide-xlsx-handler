import RuleStore from "@/stores/RuleStore";
import { DataRule } from "@/types";
import { useState } from "react";
import { DialogPlugin, Form, Input, Select, Space } from "tdesign-react";
import { getExcel } from "@/utils";
import Excel from "exceljs";

export default function () {
  const { rules } = RuleStore.useContainer();
  const [form] = Form.useForm();
  const [dataRule, setDataRule] = useState<DataRule>();
  const [dataWb, setDataWb] = useState<Excel.Workbook>();
  const [dataFile, setDataFile] = useState<File>();

  async function onConfirm(wb: Excel.Workbook, file: File) {
    const isValid = await form.validate?.();
    if (isValid !== true) return;
    const data = form.getFieldsValue?.(true);
    setDataRule({ ...data, startRow: data?.startRow });
    setDataWb(wb);
    setDataFile(file);
  }

  function openRuleDialog(wb: Excel.Workbook, file: File) {
    const d = DialogPlugin.confirm({
      header: "请选择对应规则",
      onClose: () => d.destroy(),
      onCancel: () => d.destroy(),
      onConfirm: async () => {
        await onConfirm(wb, file);
        d.destroy();
      },
      body: (
        <Form labelWidth={100} form={form}>
          <Form.FormItem name="startRow" label="数据起始行" initialData={1}>
            <Input type="number" />
          </Form.FormItem>
          {wb.worksheets.map((item) => {
            return (
              <Form.FormItem
                className="mb-6"
                name={item.name}
                key={item.name}
                rules={[{ required: true, message: "请选择规则" }]}
                label={
                  <Space align="center">
                    <div>{item.name}</div>
                    <div>➡️</div>
                  </Space>
                }
              >
                <Select>
                  {rules.map((item) => {
                    return (
                      <Select.Option key={item.id} value={item.id}>
                        {item.name}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.FormItem>
            );
          })}
        </Form>
      ),
    });
  }

  async function onDataFileChoose() {
    const { wb, file } = await getExcel();
    openRuleDialog(wb, file);
  }

  return {
    onDataFileChoose,
    dataRule,
    dataWb,
    dataFile,
  };
}
