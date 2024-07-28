import { LoginOutlined, UserAddOutlined } from "@ant-design/icons";
import { ProLayoutProps } from "@ant-design/pro-components";

// This only includes the routes for the auth pages like login and signup and not the main app routes like dashboard
const config: ProLayoutProps = {
  title: "Tasker",
  route: {
    path: "/",
    routes: [
      {
        path: "auth/login",
        name: "Login",
        icon: <LoginOutlined />,
      },
      {
        path: "auth/sign-up",
        name: "SignUp",
        icon: <UserAddOutlined />,
      },
    ],
  },
  location: {
    pathname: "/",
  },
};

export default config;
