import React, { useState } from "react";
import Register1 from "./pages/Register1";
import Register2 from "./pages/Register2";
import Register3 from "./pages/Register3";
import { router } from "expo-router";

const RegisterScreen = () => {
  const [currentPage, setCurrentPage] = useState(1);
  switch (currentPage) {
    case 1:
      return (
        <Register1
          nextPage={() => setCurrentPage(2)}
          previousPage={() => router.push("/(auth)/main")}
        />
      );

    case 2:
      return (
        <Register2
          nextPage={() => setCurrentPage(3)}
          previousPage={() => setCurrentPage(1)}
        />
      );

    case 3:
      return (
        <Register3
          nextPage={() => setCurrentPage(4)}
          previousPage={() => setCurrentPage(2)}
        />
      );
  }
};

export default RegisterScreen;
