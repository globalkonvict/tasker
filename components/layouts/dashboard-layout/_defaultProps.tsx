import pb from "@/lib/pocketbase/pocketbase";
import {
  UnorderedListOutlined,
  UserOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { ProLayoutProps } from "@ant-design/pro-components";

// This only includes the routes for the auth pages like login and signup and not the main app routes like dashboard
const config: ProLayoutProps = {
  title: "Tasker",
  route: {
    path: "/dashboard",
    routes: [
      {
        path: "/dashboard/tasks",
        name: "Tasks",
        icon: <UnorderedListOutlined />,
      },
      pb.authStore.model?.role === "admin" && {
        path: "/dashboard/users",
        name: "Users",
        icon: <UserOutlined />,
      },
      {
        path: "/dashboard/settings",
        name: "Settings",
        icon: <SettingOutlined />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default config;
