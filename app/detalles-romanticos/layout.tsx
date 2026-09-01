import { generatedBusinessMetadata } from "@/lib/generated-business-metadata";

export const metadata = generatedBusinessMetadata("detalles-romanticos");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
