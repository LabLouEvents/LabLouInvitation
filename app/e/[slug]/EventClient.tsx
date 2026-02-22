"use client";

import { useRouter } from "next/navigation";

type EventFull = {
  title: string;
  subtitle?: string | null;

  // αυτό που θα δείχνουμε στο "Έχεις πρόσκληση από"
  inviter_names?: string | null;

  // αν το έχετε αλλιώς στη βάση, βάλε κι άλλο optional εδώ
  inviter?: string | null;

  start_iso?: string | null;
};

export default function EventClient({
  event,
  slug,
  t,
}: {
  event: EventFull;
  slug: string;
  t: string;
}) {
  const router = useRouter();

  const inviter =
    (event.inviter_names || "").trim() ||
    (event.inviter || "").trim() ||
    ""; // αν είναι κενό θα δείξει « — »

  const handleOpen = () => {
    // Πήγαινε στη 2η σελίδα (με τις 4 εικόνες) και κράτα το t
    router.push(`/e/${encodeURIComponent(slug)}/section?t=${encodeURIComponent(t)}`);
  };

    return null;
}