import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Núcleo Contable | Claridad para crecer",
  description:
    "Contabilidad, tributos y asesoría financiera para empresas que quieren crecer con respaldo.",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
