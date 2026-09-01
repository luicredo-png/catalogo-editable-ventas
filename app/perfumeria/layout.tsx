import { generatedBusinessMetadata } from "@/lib/generated-business-metadata";

export const metadata = generatedBusinessMetadata("perfumeria");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
