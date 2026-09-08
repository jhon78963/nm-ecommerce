import DOMPurify from "isomorphic-dompurify";

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
] as const;

const PRODUCT_HTML_ALLOWED_ATTR = ["href", "target", "rel", "class", "colspan", "rowspan"] as const;

/** Sanitiza HTML de productos (descripción / info adicional del CMS). */
export function sanitizeProductHtml(html: string | undefined | null): string {
  if (!html?.trim()) {
    return "";
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...PRODUCT_HTML_ALLOWED_TAGS],
    ALLOWED_ATTR: [...PRODUCT_HTML_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: false,
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
] as const;

const INSTITUTIONAL_HTML_ALLOWED_ATTR = [
  ...PRODUCT_HTML_ALLOWED_ATTR,
  "action",
  "alt",
  "aria-controls",
  "aria-expanded",
  "aria-hidden",
  "aria-label",
  "aria-selected",
  "autocomplete",
  "data-bound",
  "for",
  "hidden",
  "id",
  "method",
  "name",
  "placeholder",
  "required",
  "role",
  "scope",
  "src",
  "tabindex",
  "type",
  "value",
] as const;

/** Sanitiza HTML institucional estático (formularios de contacto / libro de reclamaciones). */
export function sanitizeInstitutionalHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [...INSTITUTIONAL_HTML_ALLOWED_TAGS],
    ALLOWED_ATTR: [...INSTITUTIONAL_HTML_ALLOWED_ATTR],
    ALLOW_DATA_ATTR: true,
  });
}
