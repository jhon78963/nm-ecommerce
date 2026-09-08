import sanitizeHtml from "sanitize-html";

const PRODUCT_HTML_ALLOWED_TAGS = [
  "a",
  "b",
  "br",
  "div",
  "em",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "hr",
  "i",
  "li",
  "ol",
  "p",
  "span",
  "strong",
  "table",
  "tbody",
  "td",
  "th",
  "thead",
  "tr",
  "u",
  "ul",
];

const PRODUCT_HTML_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  a: ["href", "target", "rel"],
  td: ["colspan", "rowspan"],
  th: ["colspan", "rowspan"],
  "*": ["class"],
};

/** Sanitiza HTML de productos (descripción / info adicional del CMS). */
export function sanitizeProductHtml(html: string | undefined | null): string {
  if (!html?.trim()) {
    return "";
  }

  return sanitizeHtml(html, {
    allowedTags: PRODUCT_HTML_ALLOWED_TAGS,
    allowedAttributes: PRODUCT_HTML_ALLOWED_ATTRIBUTES,
  });
}

const INSTITUTIONAL_HTML_ALLOWED_TAGS = [
  ...PRODUCT_HTML_ALLOWED_TAGS,
  "article",
  "aside",
  "button",
  "details",
  "footer",
  "form",
  "header",
  "iframe",
  "img",
  "input",
  "label",
  "main",
  "nav",
  "section",
  "summary",
  "textarea",
];

const INSTITUTIONAL_HTML_ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  ...PRODUCT_HTML_ALLOWED_ATTRIBUTES,
  form: ["action", "id", "method"],
  img: ["alt", "src"],
  input: ["autocomplete", "id", "name", "placeholder", "required", "type", "value"],
  label: ["for"],
  textarea: ["id", "name", "placeholder", "required"],
  button: ["type", "aria-label"],
  "*": [
    "class",
    "id",
    "role",
    "hidden",
    "aria-hidden",
    "aria-label",
    "aria-selected",
    "aria-expanded",
    "aria-controls",
    "tabindex",
    "scope",
    "data-bound",
    "data-*",
  ],
};

/** Sanitiza HTML institucional estático (formularios de contacto / libro de reclamaciones). */
export function sanitizeInstitutionalHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: INSTITUTIONAL_HTML_ALLOWED_TAGS,
    allowedAttributes: INSTITUTIONAL_HTML_ALLOWED_ATTRIBUTES,
  });
}
