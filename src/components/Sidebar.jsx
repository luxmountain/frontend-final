import React from "react";
import UserList from "./UserList.jsx";

const Layout = ({ children }) => {
  return (
    <div style={{ display: "flex" }}>
      <aside
        style={{
          width: "250px",
          height: "calc(100vh - 64px)",
          position: "fixed",
          top: "64px",
          left: 0,
          overflowY: "auto",
          borderRight: "1px solid #ccc",
          backgroundColor: "#f9f9f9",
          zIndex: 1000,
        }}
      >
        <UserList />
      </aside>

      <main
        style={{
          marginLeft: "250px",
          flex: 1,
          padding: "20px",
        }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
