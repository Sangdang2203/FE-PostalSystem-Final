// components/Layout.js

import { AppBar, Button, Container, Toolbar } from "@mui/material";
import * as React from "react";

const Layout = ({ children }: any) => {
  return (
    <>
      <header>
        <AppBar position="fixed">
          <Toolbar>
            <Container
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h1>Check Fee</h1>
              <Button variant="contained" href="/app" color="secondary">
                To App
              </Button>
            </Container>
          </Toolbar>
        </AppBar>
      </header>
      <Toolbar />
      <main>{children}</main>
    </>
  );
};

export default Layout;
