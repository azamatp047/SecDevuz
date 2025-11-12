import { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Button,
  Avatar,
  Popconfirm,
  Tooltip,
  Grid,
  message,
} from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
  DashboardOutlined,
  FileTextOutlined,
  AppstoreOutlined,
  TeamOutlined,
  LogoutOutlined,
  UploadOutlined,
  EditFilled,
} from "@ant-design/icons";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { logout as logoutService } from "./services/authService";

import { FcServices } from "react-icons/fc";
import { GrServices } from "react-icons/gr";
import { LiaReplyd } from "react-icons/lia";
import { MdQuickreply } from "react-icons/md";
import { GiBuyCard } from "react-icons/gi";

const { Header, Sider, Content } = Layout;
const { useBreakpoint } = Grid;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const screens = useBreakpoint();

  useEffect(() => {
    setIsMobile(!screens.md);
  }, [screens]);

  // 🔹 MENU ITEMS (dropdownlar bilan)
  const menuItems = [
    { key: "/", icon: <DashboardOutlined />, label: <Link to="/">Dashboard</Link> },

    { key: "/users", icon: <UserOutlined />, label: <Link to="/users">Users</Link> },

    {
      key: "servicesGroup",
      icon: <FcServices />,
      label: "Services",
      children: [
        {
          key: "/services",
          icon: <FcServices />,
          label: <Link to="/services">All Services</Link>,
        },
        {
          key: "/use-services",
          icon: <GrServices />,
          label: <Link to="/use-services">Foydalanuvchilar Services</Link>,
        },
      ],
    },

    { key: "/blog", icon: <FileTextOutlined />, label: <Link to="/blog">Blog / Yangiliklar</Link> },

    {
      key: "vacancyGroup",
      icon: <EditFilled />,
      label: "Vacancies",
      children: [
        {
          key: "/vacancies/admin",
          icon: <EditFilled />,
          label: <Link to="/vacancies/admin">Vacancies</Link>,
        },
        {
          key: "/applications/admin",
          icon: <LiaReplyd />,
          label: <Link to="/applications/admin">Ariza topshiruvchilar</Link>,
        },
      ],
    },

    {
      key: "/team/admin",
      icon: <TeamOutlined />,
      label: <Link to="/team/admin">Jamoa & Certificates</Link>,
    },

    {
      key: "productsGroup",
      icon: <AppstoreOutlined />,
      label: "Products",
      children: [
        {
          key: "/products/admin",
          icon: <AppstoreOutlined />,
          label: <Link to="/products/admin">Products</Link>,
        },
        {
          key: "/buy-products",
          icon: <GiBuyCard />,
          label: <Link to="/buy-products">Sotib olmoqchilar</Link>,
        },
      ],
    },

    { key: "/uploads", icon: <UploadOutlined />, label: <Link to="/uploads">Yuklamalar</Link> },

    { key: "/comments", icon: <MdQuickreply />, label: <Link to="/comments">Izohlar</Link> },
  ];

  // 🔹 Logout
  const handleLogout = async () => {
    try {
      await logoutService();
      message.success("Logged out successfully");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Logout failed");
    }
  };

  const userName = localStorage.getItem("username") || "Admin";

  return (
    <Layout className="min-h-screen">
      {/* Sidebar */}
      {!isMobile && (
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          style={{ backgroundColor: "#141414" }}
        >
          <div className="flex items-center justify-center h-16 text-white">
            {collapsed ? (
              <span className="text-md font-bold">SecDev</span>
            ) : (
              <span className="text-lg font-bold">SecDev'Admin</span>
            )}
          </div>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            // defaultOpenKeys={["servicesGroup", "vacancyGroup", "productsGroup"]}
            items={menuItems}
            style={{ backgroundColor: "#141414", height: "100%" }}
          />
        </Sider>
      )}

      <Layout>
        {/* Header */}
        <Header
          style={{
            padding: 0,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            paddingInline: "16px",
          }}
        >
          {!isMobile && (
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ fontSize: "16px", width: 64, height: 64 }}
            />
          )}

          <div className="flex items-center gap-3">
            <Popconfirm
              title="Are you sure you want to logout?"
              okText="Yes"
              cancelText="No"
              onConfirm={handleLogout}
            >
              <Tooltip title="Logout" placement="bottom">
                <Button
                  shape="circle"
                  icon={<LogoutOutlined style={{ color: "white" }} />}
                  danger
                  style={{ backgroundColor: "#dc2626" }}
                />
              </Tooltip>
            </Popconfirm>

            <Tooltip title={userName} placement="bottom">
              <Avatar
                shape="square"
                size="large"
                icon={<UserOutlined />}
                className="cursor-pointer mr-3"
              />
            </Tooltip>
          </div>
        </Header>

        {/* Content */}
        <Content
          style={{
            margin: isMobile ? "10px" : "24px 16px",
            padding: 24,
            borderRadius: 8,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
