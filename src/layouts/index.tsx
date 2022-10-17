import { useUpdate } from "ahooks";
import classNames from "classnames";
import { Space, Tag } from "tdesign-react";
import { Link, Outlet } from "umi";

function MenuItem(
  props: React.HTMLAttributes<HTMLDivElement> & { to: string }
) {
  const { to, ...rest } = props;
  return (
    <div
      className={classNames("text-xl cursor-pointer text-purple-900", {
        "font-bold": new RegExp(`.*${to}$`).test(location.pathname),
      })}
      {...rest}
    >
      <Link to={to}>{props.children}</Link>
    </div>
  );
}

export default function Layout() {
  const update = useUpdate();

  return (
    <div className="p-6 bg-purple-50 h-screen">
      <header className="flex justify-between align-middle mb-6">
        <Space size="small">
          <div className="text-3xl font-bold text-purple-900">
            表格映射小助手
          </div>
          <Tag size="small" theme="primary" shape="round" variant="light">
            Only for Chrome
          </Tag>
        </Space>
        <div className="flex gap-4" onClick={update}>
          <MenuItem to="/">首页</MenuItem>
          <MenuItem to="/rules">规则</MenuItem>
          <MenuItem to="/guide">教程</MenuItem>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
