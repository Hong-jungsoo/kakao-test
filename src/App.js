import React from "react";
import KakaoLink from "./components/KakaoLink";

function App() {
  return (
    <div style={{ padding: "16px", textAlign: "center" }}>
      <h1 style={{ backgroundColor: "#6200ea", color: "#fff", padding: "8px 0" }}>
        카카오톡 웹
      </h1>
      <KakaoLink />
    </div>
  );
}

export default App;
