import RuleStore from "@/stores/RuleStore";
import { Rule } from "@/types";
import { useState } from "react";
import {
  Button,
  message,
  Popconfirm,
  PrimaryTableRenderParams,
  Space,
  Table,
} from "tdesign-react";
import RuleDrawer from "./components/RuleDrawer";

export default function () {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { rules, setRules } = RuleStore.useContainer();
  const [curRule, setCurRule] = useState<Rule>();

  const onDelete = (id: string) => () => {
    setRules(rules.filter((item) => item.id !== id));
    message.success("删除成功");
  };

  const onEdit = (id: string) => () => {
    setCurRule(rules.find((item) => item.id === id));
    setDrawerVisible(true);
  };

  const onDrawerClose = () => {
    setDrawerVisible(false);
    setCurRule(undefined);
  };

  const operationRender = (props: PrimaryTableRenderParams<Rule>) => {
    if (props.type === "title") {
      return props.col.title as string;
    }
    return (
      <Space size="small">
        <Button onClick={onEdit(props.row.id)} size="small">
          编辑
        </Button>
        <Popconfirm onConfirm={onDelete(props.row.id)} content="确定删除？">
          <Button size="small" theme="danger">
            删除
          </Button>
        </Popconfirm>
      </Space>
    );
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div />
        <Space>
          <Button onClick={() => setDrawerVisible(true)}>🚀 新增规则</Button>
          <Button onClick={() => message.info("Doing...")}>📲 导入规则</Button>
          <Button onClick={() => message.info("Doing...")}>📦 导出规则</Button>
        </Space>
      </div>
      <div>
        <Table<Rule>
          rowKey="id"
          hover
          columns={[
            { title: "名称", colKey: "name" },
            { title: "创建时间", colKey: "createdTime" },
            {
              title: "上次修改时间",
              colKey: "modifiedTime",
              render(props) {
                return props.type === "title"
                  ? (props.col.title as string)
                  : props.row.modifiedTime || "-";
              },
            },
            {
              title: "操作",
              colKey: "id",
              render: operationRender,
            },
          ]}
          data={rules}
        />
      </div>
      {drawerVisible && (
        <RuleDrawer curRule={curRule} onClose={onDrawerClose} />
      )}
    </div>
  );
}
