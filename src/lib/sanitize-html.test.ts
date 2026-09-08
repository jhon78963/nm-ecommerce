import { describe, expect, it } from "vitest";

import {
  sanitizeInstitutionalHtml,
  sanitizeProductHtml,
} from "@/lib/sanitize-html";

describe("sanitizeProductHtml", () => {
  it("removes script tags from product descriptions", () => {
    const html = '<p>Hola</p><script>alert("xss")</script>';

    expect(sanitizeProductHtml(html)).toBe("<p>Hola</p>");
  });

  it("allows basic formatting tags", () => {
    const html = "<p><strong>Algodón</strong> 100%</p>";

    expect(sanitizeProductHtml(html)).toBe(html);
  });

  it("returns empty string for blank input", () => {
    expect(sanitizeProductHtml("   ")).toBe("");
    expect(sanitizeProductHtml(null)).toBe("");
  });
});

describe("sanitizeInstitutionalHtml", () => {
  it("keeps form fields but strips scripts", () => {
    const html =
      '<form id="nm-contact-form"><input name="email" type="email" /><script>steal()</script></form>';

    expect(sanitizeInstitutionalHtml(html)).not.toContain("<script");
    expect(sanitizeInstitutionalHtml(html)).toContain('id="nm-contact-form"');
  });
});
