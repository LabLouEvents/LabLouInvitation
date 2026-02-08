"use client";

type Props = {
  src: string;
  alt?: string;
};

export default function ClientCoverImage({ src, alt }: Props) {
  return (
    <img
      src={src}
      alt={alt || ""}
      style={{
        width: "100%",
        height: "auto",
        borderRadius: 12,
        display: "block",
      }}
    />
  );
}