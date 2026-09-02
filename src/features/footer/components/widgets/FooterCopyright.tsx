interface FooterCopyrightProps {
  content: string;
}

export function FooterCopyright({ content }: FooterCopyrightProps) {
  if (!content) {
    return null;
  }

  return (
    <div className="footer-end">
      <p>{content}</p>
    </div>
  );
}
