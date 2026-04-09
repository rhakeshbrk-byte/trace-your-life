import { ReactNode } from "react";
import BottomNav from "./BottomNav";

const AppLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background pb-16">
    {children}
    <BottomNav />
  </div>
);

export default AppLayout;
