import React from "react";
import { ErrorBoundary, Content } from "@components";
import { Subscribe } from "@layouts";

export const App = () => {
  return (
    <ErrorBoundary>
      <Content>
        <Subscribe />
      </Content>
    </ErrorBoundary>
  );
};
