import { useEffect, useMemo, useState } from "react";
import {
  AppBar,
  Box,
  Drawer,
  Breadcrumbs,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Link,
  Stack,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Divider,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ArticleIcon from "@mui/icons-material/Article";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import FolderIcon from "@mui/icons-material/Folder";
import CategoryIcon from "@mui/icons-material/Category";
import RuleIcon from "@mui/icons-material/Rule";
import GroupIcon from "@mui/icons-material/Group";
import StorefrontIcon from "@mui/icons-material/Storefront";
import StoreIcon from "@mui/icons-material/Store";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import InsightsIcon from "@mui/icons-material/Insights";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIconOutlined from "@mui/icons-material/StoreOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import BadgeIcon from "@mui/icons-material/Badge";
import "./App.css";
import { appRoutes } from "./routes";
import { roleLabels, type Role } from "./roles";
import { useAuth, useSession, useStoreContext, useStoreInfo } from "./hooks";

const drawerWidth = 280;
const defaultRoute = "/dashboard";
const loginRoute = "/login";
const roleStorageKey = "jutjanops-role";

type NavGroup = {
  title: string;
  items: typeof appRoutes;
};

function useHashRoute() {
  const [path, setPath] = useState(() => {
    if (globalThis.location.hash)
      return globalThis.location.hash.replace("#", "");
    return defaultRoute;
  });

  useEffect(() => {
    const onHashChange = () => {
      setPath(globalThis.location.hash.replace("#", "") || defaultRoute);
    };
    globalThis.addEventListener("hashchange", onHashChange);
    return () => globalThis.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (next: string) => {
    const current = globalThis.location.hash.replace("#", "") || defaultRoute;
    if (current === next) return;
    globalThis.location.hash = next;
  };

  return { path, navigate };
}

function getInitialRole(): Role {
  const stored = globalThis.localStorage.getItem(roleStorageKey) as Role | null;
  if (stored) {
    return stored;
  }
  return "STORE_MANAGER";
}

function getRouteIcon(path: string) {
  switch (path) {
    case "/dashboard":
      return <DashboardIcon fontSize="small" />;
    case "/documents":
      return <ArticleIcon fontSize="small" />;
    case "/master/items":
      return <Inventory2Icon fontSize="small" />;
    case "/master/item-groups":
      return <FolderIcon fontSize="small" />;
    case "/master/expense-categories":
      return <CategoryIcon fontSize="small" />;
    case "/master/po-rules":
      return <RuleIcon fontSize="small" />;
    case "/members":
      return <GroupIcon fontSize="small" />;
    case "/system/merchants":
      return <StorefrontIcon fontSize="small" />;
    case "/system/stores":
      return <StoreIcon fontSize="small" />;
    case "/system/users":
      return <PeopleAltIcon fontSize="small" />;
    case "/system/dashboard":
      return <InsightsIcon fontSize="small" />;
    case "/system/billing":
      return <CreditCardIcon fontSize="small" />;
    default:
      return <ArticleIcon fontSize="small" />;
  }
}

export default function App() {
  const [role] = useState<Role>(() => getInitialRole());
  const [mobileOpen, setMobileOpen] = useState(false);
  const { path, navigate } = useHashRoute();
  const { accessToken, ready, userEmail } = useSession();
  const { logout, loading } = useAuth();
  const { storeName } = useStoreInfo();

  useStoreContext();

  useEffect(() => {
    globalThis.localStorage.setItem(roleStorageKey, role);
  }, [role]);

  const visibleRoutes = useMemo(
    () => appRoutes.filter((route) => route.roles.includes(role)),
    [role],
  );

  const activeRoute = visibleRoutes.find((route) => route.path === path);
  const fallbackRoute = visibleRoutes[0] ?? appRoutes[0];
  const content = activeRoute?.component ?? fallbackRoute.component;

  useEffect(() => {
    if (!ready) return;
    if (!accessToken && path !== loginRoute) {
      navigate(loginRoute);
      return;
    }
    if (accessToken && path === loginRoute) {
      navigate(defaultRoute);
      return;
    }
    if (!activeRoute && fallbackRoute && path !== loginRoute) {
      navigate(fallbackRoute.path);
    }
  }, [accessToken, activeRoute, fallbackRoute, navigate, path, ready]);

  const groupedNav = useMemo<NavGroup[]>(() => {
    const groups: Record<string, typeof appRoutes> = {};
    visibleRoutes.forEach((route) => {
      if (route.path === loginRoute) return;
      if (!groups[route.group]) groups[route.group] = [];
      groups[route.group].push(route);
    });
    return Object.entries(groups).map(([title, items]) => ({ title, items }));
  }, [visibleRoutes]);

  const roleBadge = roleLabels[role];
  const routeLabelMap = useMemo(
    () => new Map(appRoutes.map((route) => [route.path, route.label])),
    []
  );
  const breadcrumbItems = useMemo(() => {
    if (path === loginRoute) return [];
    const items: { label: string; path: string }[] = [];
    const homePath = fallbackRoute?.path ?? defaultRoute;
    const homeLabel = routeLabelMap.get(homePath) ?? "ໜ້າຫຼັກ";
    const currentLabel =
      routeLabelMap.get(path) ?? activeRoute?.label ?? fallbackRoute.label;

    items.push({ label: homeLabel, path: homePath });
    if (path !== homePath) {
      items.push({ label: currentLabel, path });
    }

    return items;
  }, [activeRoute, fallbackRoute, path, routeLabelMap]);

  if (path === loginRoute) {
    return <div className="login-wrapper">{content}</div>;
  }

  const drawer = (
    <Box
      className="sider-shell"
      sx={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box className="sider-brand">
        <Box className="brand-mark">JO</Box>
        <Box>
          <Typography variant="h6">Jutjan OPS</Typography>
          <Typography variant="body2" color="text.secondary">
            ບໍລິຫານວຽກງານຮ້ານ
          </Typography>
        </Box>
      </Box>

      <Box className="sider-info-inline">
        <Box className="info-chip">
          <StoreIconOutlined fontSize="small" />
          <Typography variant="caption" className="ellipsis">
            {storeName || "ບໍ່ພົບຊື່ຮ້ານ"}
          </Typography>
        </Box>
        <Box className="info-chip">
          <PersonOutlineIcon fontSize="small" />
          <Typography variant="caption" className="ellipsis">
            {userEmail || "ບໍ່ພົບອີເມວ"}
          </Typography>
        </Box>
        <Box className="info-chip">
          <BadgeIcon fontSize="small" />
          <Typography variant="caption" className="ellipsis">
            {roleBadge}
          </Typography>
        </Box>
      </Box>

      <List className="sider-nav">
        {groupedNav.map((group) => (
          <li key={group.title}>
            <ul style={{ padding: 0 }}>
              {group.items.map((route) => (
                <ListItemButton
                  key={route.path}
                  selected={route.path === path}
                  onClick={() => navigate(route.path)}
                  className="sider-item"
                >
                  <ListItemIcon className="sider-icon">
                    {getRouteIcon(route.path)}
                  </ListItemIcon>
                  <ListItemText primary={route.label} />
                </ListItemButton>
              ))}
            </ul>
          </li>
        ))}
      </List>
      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={logout}
          disabled={loading}
          fullWidth
        >
          ອອກຈາກລະບົບ
        </Button>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        color="transparent"
        elevation={0}
        className="app-bar"
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton
              color="inherit"
              edge="start"
              onClick={() => setMobileOpen((prev) => !prev)}
              sx={{ display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Stack spacing={0.5}>
              <Typography variant="body2" color="text.secondary">
                Jutjan OPS
              </Typography>
              <Typography variant="h6">
                {activeRoute?.label ?? fallbackRoute.label}
              </Typography>
              {!!breadcrumbItems.length && (
                <Breadcrumbs className="app-breadcrumbs" aria-label="breadcrumb">
                  {breadcrumbItems.map((crumb, index) =>
                    index === breadcrumbItems.length - 1 ? (
                      <Typography
                        key={crumb.path}
                        variant="caption"
                        color="text.secondary"
                      >
                        {crumb.label}
                      </Typography>
                    ) : (
                      <Link
                        key={crumb.path}
                        underline="hover"
                        color="inherit"
                        variant="caption"
                        onClick={() => navigate(crumb.path)}
                        sx={{ cursor: "pointer" }}
                      >
                        {crumb.label}
                      </Link>
                    )
                  )}
                </Breadcrumbs>
              )}
            </Stack>
          </Stack>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }} className="app-content">
        <Toolbar />
        <div className="content-inner">{content}</div>
      </Box>
    </Box>
  );
}
