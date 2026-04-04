/**
 * Render email editor blocks to HTML string with inline styles.
 * Uses table-based layout for email client compatibility.
 * Virtually Yours styling: dark bg (#1a1a1a), card (#222222), gold (#c89c6f).
 */

export interface EmailBlock {
  id: string;
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  order: number;
}

// ---- Individual block renderers ----

function renderHeadingBlock(props: { text: string; level: number; color: string; align: string }): string {
  const tag = props.level === 2 ? "h2" : "h1";
  const size = props.level === 2 ? "20px" : "26px";
  return `<${tag} style="color: ${props.color || "#ffffff"}; font-size: ${size}; font-weight: 700; text-align: ${props.align || "left"}; margin: 0 0 16px; font-family: Georgia, serif;">${escapeHtml(props.text || "")}</${tag}>`;
}

function renderTextBlock(props: { text: string; fontSize: number; color: string; align: string }): string {
  return `<p style="margin: 0 0 16px; font-size: ${props.fontSize}px; color: ${props.color}; text-align: ${props.align}; line-height: 1.6; white-space: pre-line;">${escapeHtml(props.text || "")}</p>`;
}

function renderImageBlock(props: { src: string; alt: string; width: number; align: string; href?: string }): string {
  if (!props.src) return "";
  const margin =
    props.align === "center"
      ? "0 auto"
      : props.align === "right"
        ? "0 0 0 auto"
        : "0 auto 0 0";
  const imgTag = `<img src="${escapeAttr(props.src)}" alt="${escapeAttr(props.alt || "")}" style="width: ${props.width}px; max-width: 100%; border-radius: 8px; display: block; margin: ${margin};" />`;
  const inner = props.href && props.href.trim() !== ""
    ? `<a href="${escapeAttr(props.href)}" style="text-decoration: none;">${imgTag}</a>`
    : imgTag;
  return `<div style="text-align: ${props.align}; margin: 16px 0;">
  ${inner}
</div>`;
}

function renderButtonBlock(props: {
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  borderRadius: number;
}): string {
  return `<div style="text-align: center; margin: 24px 0;">
  <a href="${escapeAttr(props.url || "#")}" style="display: inline-block; background-color: ${props.bgColor}; color: ${props.textColor}; padding: 12px 28px; border-radius: ${props.borderRadius}px; text-decoration: none; font-weight: 600; font-size: 16px;">${escapeHtml(props.text || "Button")}</a>
</div>`;
}

function renderDividerBlock(props: { color: string; thickness: number }): string {
  return `<hr style="border: none; border-top: ${props.thickness}px solid ${props.color}; margin: 16px 0;" />`;
}

function renderColumnItem(item: { type: string; text?: string; src?: string; alt?: string; width?: number; url?: string; bgColor?: string; textColor?: string }): string {
  switch (item.type) {
    case "text":
      return `<div style="color: #e0e0e0; font-size: 14px; line-height: 1.6;">${escapeHtml(item.text || "")}</div>`;
    case "image":
      return item.src
        ? `<div style="text-align: center;"><img src="${escapeAttr(item.src)}" alt="${escapeAttr(item.alt || "")}" style="max-width: 100%; width: ${item.width || 260}px; height: auto;" /></div>`
        : "";
    case "button":
      return `<div style="text-align: center; padding: 4px 0;"><a href="${escapeAttr(item.url || "#")}" style="display: inline-block; padding: 10px 24px; background-color: ${item.bgColor || "#c89c6f"}; color: ${item.textColor || "#1a1a1a"}; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">${escapeHtml(item.text || "Button")}</a></div>`;
    default:
      return "";
  }
}

function renderColumnsBlock(props: { leftContent: string; rightContent: string; leftItems?: Array<{ type: string; [key: string]: unknown }>; rightItems?: Array<{ type: string; [key: string]: unknown }> }): string {
  const hasItems = (props.leftItems?.length || 0) > 0 || (props.rightItems?.length || 0) > 0;
  const leftHtml = hasItems
    ? (props.leftItems || []).map((item) => renderColumnItem(item as Parameters<typeof renderColumnItem>[0])).join("")
    : escapeHtml(props.leftContent || "");
  const rightHtml = hasItems
    ? (props.rightItems || []).map((item) => renderColumnItem(item as Parameters<typeof renderColumnItem>[0])).join("")
    : escapeHtml(props.rightContent || "");

  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin: 16px 0;">
  <tr>
    <td style="width: 50%; vertical-align: top; padding: 8px 12px 8px 0;">${leftHtml}</td>
    <td style="width: 50%; vertical-align: top; padding: 8px 0 8px 12px;">${rightHtml}</td>
  </tr>
</table>`;
}

function renderHeaderBlock(props: { logoUrl: string; title: string }): string {
  const logo = props.logoUrl
    ? `<img src="${escapeAttr(props.logoUrl)}" alt="${escapeAttr(props.title || "Virtually Yours")}" style="height: 64px; margin-bottom: 8px;" />`
    : "";
  const title = props.title
    ? `<div style="color: #c89c6f; font-size: 20px; font-weight: 700;">${escapeHtml(props.title)}</div>`
    : "";
  return `<td align="center" style="padding-bottom: 24px;">${logo}${title}</td>`;
}

function renderFooterBlock(props: { text: string; unsubscribeUrl: string }): string {
  return `<td style="padding: 24px 0; text-align: center; border-top: 1px solid rgba(200, 156, 111, 0.2);">
  <p style="color: #666; font-size: 12px; margin: 0 0 4px;">${escapeHtml(props.text || "Virtually Yours")}</p>
  <p style="color: #555; font-size: 11px; margin: 0 0 8px;">Virtually Yours — Nederland</p>
  <a href="${escapeAttr(props.unsubscribeUrl || "#")}" style="color: #c89c6f; font-size: 11px; text-decoration: underline;">Unsubscribe</a>
</td>`;
}

// ---- Main render function ----

export function renderBlocksToHtml(blocks: EmailBlock[]): string {
  const sorted = [...blocks].sort((a, b) => a.order - b.order);

  let headerHtml = "";
  let footerHtml = "";
  const bodyParts: string[] = [];

  for (const block of sorted) {
    switch (block.type) {
      case "email-header":
        headerHtml = renderHeaderBlock(block.props as { logoUrl: string; title: string });
        break;
      case "email-footer":
        footerHtml = renderFooterBlock(block.props as { text: string; unsubscribeUrl: string });
        break;
      case "email-heading":
        bodyParts.push(renderHeadingBlock(block.props as { text: string; level: number; color: string; align: string }));
        break;
      case "email-text":
        bodyParts.push(renderTextBlock(block.props as { text: string; fontSize: number; color: string; align: string }));
        break;
      case "email-image":
        bodyParts.push(renderImageBlock(block.props as { src: string; alt: string; width: number; align: string; href?: string }));
        break;
      case "email-button":
        bodyParts.push(renderButtonBlock(block.props as { text: string; url: string; bgColor: string; textColor: string; borderRadius: number }));
        break;
      case "email-divider":
        bodyParts.push(renderDividerBlock(block.props as { color: string; thickness: number }));
        break;
      case "email-columns":
        bodyParts.push(renderColumnsBlock(block.props as { leftContent: string; rightContent: string }));
        break;
      default:
        break;
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://virtually-yours.nl";

  if (!headerHtml) {
    headerHtml = renderHeaderBlock({ logoUrl: `${siteUrl}/logo.png`, title: "" });
  }
  if (!footerHtml) {
    footerHtml = renderFooterBlock({ text: "Virtually Yours — virtually-yours.nl", unsubscribeUrl: "{{unsubscribeUrl}}" });
  }

  return `<!DOCTYPE html>
<html lang="nl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<style>
  @media only screen and (max-width: 620px) {
    .email-container { width: 100% !important; padding: 16px !important; }
    .email-body { padding: 20px !important; }
    img { max-width: 100% !important; height: auto !important; }
  }
</style>
</head>
<body style="margin: 0; padding: 0; background-color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #1a1a1a;">
    <tr><td align="center" style="padding: 32px 16px;">
      <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">
        <tr>${headerHtml}</tr>
        <tr><td class="email-body" style="background-color: #222222; border-radius: 12px; padding: 32px; border: 1px solid rgba(200, 156, 111, 0.2);">
          ${bodyParts.join("\n          ")}
        </td></tr>
        <tr>${footerHtml}</tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ---- HTML escaping helpers ----

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeAttr(str: string): string {
  return str.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
