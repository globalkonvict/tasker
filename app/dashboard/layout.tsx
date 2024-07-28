import { RealtimeProvider } from "@/contexts/realtime-context";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RealtimeProvider>{children}</RealtimeProvider>;
}
