import StreamVideoProvider from "@/Providers/StreamClientprovider";
import React, { ReactNode } from "react";

const layout = ({ children }: { children: ReactNode }) => {
  return <StreamVideoProvider>{children}</StreamVideoProvider>;
};

export default layout;
