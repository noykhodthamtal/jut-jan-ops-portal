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
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import BadgeIcon from "@mui/icons-material/Badge";
import "./App.css";
import { appRoutes } from "./routes";
import { roleLabels, type Role } from "./roles";
import { useAuth, useSession, useStoreContext, useStoreInfo } from "./hooks";
import { useMerchantInfo } from "./hooks/useMerchantInfo";

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
  const { merchantName } = useMerchantInfo();

  const isOwner = role === 'SYSTEM_OWNER';
  const displayName = isOwner
    ? (merchantName || '')
    : (storeName || '');
  const displayFallback = isOwner ? 'ບໍ່ພົບຊື່ຮ້ານຄ້າ' : 'ບໍ່ພົບຊື່ຮ້ານ';

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
          <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#111827' }}>Jutjan OPS</Typography>
          <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 500, fontSize: '0.85rem' }}>
            ບໍລິຫານວຽກງານຮ້ານ
          </Typography>
        </Box>
      </Box>

      <Box className="sider-info-inline">
        <Box className="info-chip">
          {isOwner ? <StorefrontIcon fontSize="small" /> : <StoreIconOutlined fontSize="small" />}
          <Typography variant="caption" className="ellipsis">
            {displayName || displayFallback}
          </Typography>
        </Box>
        <Box className="info-chip">
          <PersonOutlineIcon fontSize="small" />
          <Typography variant="caption" className="ellipsis">
            {userEmail || "ບໍ່ພົບອີເມວ"}
          </Typography>
        </Box>
        <Box sx={{ pt: 0.5 }}>
          {role === 'SYSTEM_OWNER' && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 1.25, py: 0.5, borderRadius: 99,
              bgcolor: '#F3E8FF', border: '1px solid #E9D5FF',
            }}>
              <AdminPanelSettingsIcon sx={{ fontSize: '0.9rem', color: '#9333EA' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#6B21A8', lineHeight: 1 }}>
                {roleBadge}
              </Typography>
            </Box>
          )}
          {role === 'STORE_MANAGER' && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 1.25, py: 0.5, borderRadius: 99,
              bgcolor: '#EFF6FF', border: '1px solid #BFDBFE',
            }}>
              <ManageAccountsIcon sx={{ fontSize: '0.9rem', color: '#2563EB' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#1D4ED8', lineHeight: 1 }}>
                ຜູ້ຈັດການ
              </Typography>
            </Box>
          )}
          {role === 'STORE_STAFF' && (
            <Box sx={{
              display: 'inline-flex', alignItems: 'center', gap: 0.75,
              px: 1.25, py: 0.5, borderRadius: 99,
              bgcolor: '#ECFDF5', border: '1px solid #A7F3D0',
            }}>
              <BadgeIcon sx={{ fontSize: '0.9rem', color: '#059669' }} />
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', lineHeight: 1 }}>
                ພະນັກງານ
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      <List className="sider-nav">
        {groupedNav.map((group) => (
          <li key={group.title} style={{ listStyle: 'none' }}>
            <Typography className="sider-nav-group-title">
              {group.title}
            </Typography>
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
                  <ListItemText primary={route.label} disableTypography sx={{ fontSize: '0.9rem', color: route.path === path ? '#E63946' : '#475569' }} />
                </ListItemButton>
              ))}
            </ul>
          </li>
        ))}
      </List>
      <Box sx={{ mt: "auto", p: 2 }}>
        <Divider sx={{ mb: 2, borderColor: 'rgba(0,0,0,0.04)' }} />
        <Button
          variant="outlined"
          startIcon={<LogoutIcon />}
          onClick={logout}
          disabled={loading}
          fullWidth
          sx={{
            borderColor: '#E2E8F0',
            color: '#64748B',
            '&:hover': { borderColor: '#E63946', color: '#E63946', backgroundColor: '#FFF0F0' }
          }}
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
              <Breadcrumbs className="app-breadcrumbs" aria-label="breadcrumb">
                {breadcrumbItems.map((crumb, index) =>
                  index === breadcrumbItems.length - 1 ? (
                    <Typography
                      key={crumb.path}
                      variant="h6"
                      sx={{ color: '#111827', fontWeight: 700 }}
                    >
                      {crumb.label}
                    </Typography>
                  ) : (
                    <Link
                      key={crumb.path}
                      underline="hover"
                      color="inherit"
                      variant="body1"
                      onClick={() => navigate(crumb.path)}
                      sx={{ cursor: "pointer", fontWeight: 500, color: '#64748B' }}
                    >
                      {crumb.label}
                    </Link>
                  )
                )}
              </Breadcrumbs>
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
