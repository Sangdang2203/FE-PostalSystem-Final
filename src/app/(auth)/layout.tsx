"use client";
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import { Menu } from "@mui/icons-material";
import { Container } from "@mui/material";
import AvatarMenu from "@/components/AvatarMenu";

import { useSession } from "next-auth/react";

const AppLayout = (props: { children: React.ReactNode; window?: Window }) => {
  const drawerWidth = 250;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [isClosing, setIsClosing] = React.useState(false);

  const { data: session, status } = useSession();
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* Navbar */}
      <AppBar
        position="fixed">
        <Toolbar>
          <Container
            sx={{
              display: "flex", justifyContent: "space-between", alignItems: "center"
            }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: "none" } }}>
              <Menu />
            </IconButton>
            <div></div>
            <AvatarMenu />
          </Container>
        </Toolbar>
      </AppBar>


      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#f1f1f1",
          minHeight: "100vh",
        }}>
        <Toolbar />
        <Container maxWidth={"xl"}>{props.children}</Container>
      </Box>
    </Box>
  );
};
export default AppLayout;
