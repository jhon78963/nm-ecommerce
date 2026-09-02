interface FooterAboutProps {
  text: string;
}

export function FooterAbout({ text }: FooterAboutProps) {
  if (!text) {
    return null;
  }

  return <p>{text}</p>;
}
