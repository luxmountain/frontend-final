import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "./TopBar";
import { Box, Toolbar } from "@mui/material";

const Layout = () => {
  return (
    <>
      <TopBar />
      <Toolbar /> {/* spacer for fixed AppBar */}
      <Box sx={{ padding: 2 }}>
        <Outlet />
      </Box>
    </>
  );
};

export default Layout;
