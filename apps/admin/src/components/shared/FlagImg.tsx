import { getFlagUrl } from "@/lib/langFlags";

interface FlagImgProps {
  langCode: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const SIZE_MAP = {
  sm: { cdnSize: "20x15" as const, width: 20, height: 15 },
  md: { cdnSize: "24x18" as const, width: 24, height: 18 },
  lg: { cdnSize: "32x24" as const, width: 32, height: 24 },
};

export default function FlagImg({ langCode, size = "md", className }: FlagImgProps) {
  const { cdnSize, width, height } = SIZE_MAP[size];
  const src = getFlagUrl(langCode, cdnSize);

  return (
    <img
      src={src}
      alt={langCode}
      width={width}
      height={height}
      className={`rounded-[2px] object-cover flex-shrink-0 ${className ?? ""}`}
      style={{ display: "inline-block" }}
    />
  );
}
