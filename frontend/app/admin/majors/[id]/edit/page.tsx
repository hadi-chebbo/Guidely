"use client";

import { usePathname } from "next/navigation";
import EditMajorClient from "./EditMajorClient";

export default function EditMajorPage() {
  const pathname = usePathname();
  const id = pathname.split("/").filter(Boolean).at(-2);

  return <EditMajorClient majorId={Number(id)} />;
}
