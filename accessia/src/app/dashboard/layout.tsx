
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const autenticado = await isAdmin();

    if (!autenticado) {
        redirect("/login");
    }

    return <>{children}</>;
}
