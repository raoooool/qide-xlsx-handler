import RuleStore from "@/stores/RuleStore";
import { Rule } from "@/types";
import { useState } from "react";
import { Button, Space, Table } from "tdesign-react";
import RuleDrawer from "./components/RuleDrawer";

export default function () {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { rules } = RuleStore.useContainer();

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div />
        <Space>
          <Button onClick={() => setDrawerVisible(true)}>🚀 新增规则</Button>
        </Space>
      </div>
      <div>
        <Table<Rule>
          rowKey="id"
          hover
          columns={[
            { title: "名称", colKey: "name" },
            { title: "创建时间", colKey: "createdTime" },
          ]}
          data={rules}
        />
      </div>
      {drawerVisible && <RuleDrawer onClose={() => setDrawerVisible(false)} />}
    </div>
  );
}
