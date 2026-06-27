type LocalizedTextProps = {
  ar: string;
  en?: string;
  className?: string;
};

export function LocalizedText({ ar, en, className }: LocalizedTextProps) {
  const english = en || ar;
  return (
    <>
      <span className={`lang-ar ${className ?? ""}`}>{ar}</span>
      <span className={`lang-en ${className ?? ""}`}>{english}</span>
    </>
  );
}
