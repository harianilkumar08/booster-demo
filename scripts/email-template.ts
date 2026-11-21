import type { Boutique, Screen } from "../lib/types";
import type { SiteConfig } from "./data";

export interface EmailImage {
  screen: Screen;
  src: string;
  width: number;
  height: number;
}

const FONT = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";
const INK = "#121211";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function demoLink(config: SiteConfig, b: Boutique, src: string): string {
  return `${config.siteUrl}/demo/${b.slug}?src=${encodeURIComponent(src)}`;
}

export function subjectLine(b: Boutique): string {
  return `A within-the-hour checkout concept for ${b.name}`;
}

function sections(b: Boutique): Record<Screen, { label: string; title: string; body: string; alt: string }> {
  return {
    cart: {
      label: "01 · Your bag",
      title: "Your checkout, as your customers know it",
      body: "The bag looks and feels like yours. Nothing changes for the customer until they reach delivery.",
      alt: `Phone mockup of the ${b.name} shopping bag, showing two items and the order subtotal`,
    },
    checkout: {
      label: "02 · Delivery",
      title: "Booster, alongside your existing options",
      body: "A third option sits under Standard and Next day: delivery within the hour for a flat £25, paid by the customer.",
      alt: `Phone mockup of the ${b.name} delivery step with the Booster within-1-hour option selected for £25`,
    },
    tracking: {
      label: "03 · Tracking",
      title: "A calm, live view of the delivery",
      body: "After ordering, your customer sees their rider on a simple timeline, from packed to delivered.",
      alt: `Phone mockup of the ${b.name} order confirmation with a live delivery timeline and map`,
    },
  };
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;">
  <tr>
    <td align="center" bgcolor="${INK}" style="border-radius:999px;background-color:${INK};">
      <a href="${esc(href)}" target="_blank" style="display:inline-block;padding:12px 22px;font-family:${FONT};font-size:14px;font-weight:600;line-height:16px;color:#ffffff;text-decoration:none;border-radius:999px;">${esc(label)} &rarr;</a>
    </td>
  </tr>
</table>`;
}

export function renderEmailHtml(b: Boutique, config: SiteConfig, images: EmailImage[]): string {
  const copy = sections(b);
  const mainLink = demoLink(config, b, "email-text");
  const unsubscribe = `mailto:${config.contactEmail}?subject=${encodeURIComponent(`Unsubscribe ${b.name}`)}`;

  const rows = images
    .map((img) => {
      const c = copy[img.screen];
      const href = demoLink(config, b, `email-${img.screen}`);
      return `
          <tr>
            <td style="padding:0 40px 36px 40px;">
              <table role="presentation" width="520" cellpadding="0" cellspacing="0" border="0" style="width:520px;">
                <tr>
                  <td width="240" valign="top" style="width:240px;">
                    <a href="${esc(href)}" target="_blank" style="text-decoration:none;">
                      <img src="${esc(img.src)}" width="${img.width}" height="${img.height}" alt="${esc(c.alt)}" style="display:block;width:${img.width}px;height:auto;max-width:100%;border:0;outline:none;text-decoration:none;font-family:${FONT};font-size:13px;color:#6b665e;" />
                    </a>
                  </td>
                  <td width="24" style="width:24px;font-size:0;line-height:0;">&nbsp;</td>
                  <td width="256" valign="middle" style="width:256px;">
                    <p style="margin:0 0 10px 0;font-family:${FONT};font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#8a847a;">${esc(c.label)}</p>
                    <p style="margin:0 0 10px 0;font-family:${SERIF};font-size:22px;line-height:28px;color:${INK};">${esc(c.title)}</p>
                    <p style="margin:0 0 20px 0;font-family:${FONT};font-size:14px;line-height:22px;color:#55514a;">${esc(c.body)}</p>
                    ${button(href, "See it live")}
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en-GB" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta name="format-detection" content="telephone=no, date=no, address=no, email=no" />
  <title>${esc(subjectLine(b))}</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f4f1eb;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f1eb;opacity:0;">
    We mocked up ${esc(b.name)}&rsquo;s checkout with a flat &pound;25 within-the-hour delivery option.&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f1eb" style="background-color:#f4f1eb;">
    <tr>
      <td align="center" style="padding:32px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#ffffff" style="width:600px;max-width:600px;background-color:#ffffff;border-radius:16px;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 40px 24px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:${FONT};font-size:18px;font-weight:700;letter-spacing:-0.3px;color:${INK};">
                    <span style="color:#b5cc3a;">&#9889;</span> Booster
                  </td>
                  <td align="right" style="font-family:${FONT};font-size:12px;color:#8a847a;">
                    A concept for ${esc(b.name)}
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td height="3" bgcolor="${esc(b.brandColor)}" style="height:3px;font-size:0;line-height:0;background-color:${esc(b.brandColor)};">&nbsp;</td></tr></table></td>
          </tr>
          <!-- Intro -->
          <tr>
            <td style="padding:36px 40px 12px 40px;">
              <p style="margin:0 0 18px 0;font-family:${SERIF};font-size:30px;line-height:36px;color:${INK};">${esc(b.name)}, within the hour.</p>
              <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3d3a35;">Hi ${esc(b.name)} team,</p>
              <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3d3a35;">We put together a short concept of your checkout with Booster built in: a flat &pound;25 option for customers who want their order delivered within the hour.</p>
              <p style="margin:0 0 28px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3d3a35;">With your boutique in ${esc(b.neighbourhood)}, we thought you might like to see how it would look. Each screen below opens a clickable demo styled for ${esc(b.name)}.</p>
            </td>
          </tr>
          ${rows}
          <!-- Plain-text fallback -->
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <p style="margin:0;padding:16px 18px;background-color:#f7f5f0;border-radius:10px;font-family:${FONT};font-size:13px;line-height:20px;color:#55514a;">
                Images not showing? Open the demo here:<br />
                <a href="${esc(mainLink)}" target="_blank" style="color:${INK};text-decoration:underline;word-break:break-all;">${esc(mainLink)}</a>
              </p>
            </td>
          </tr>
          <!-- Sign-off -->
          <tr>
            <td style="padding:0 40px 40px 40px;">
              <p style="margin:0 0 12px 0;font-family:${FONT};font-size:15px;line-height:24px;color:#3d3a35;">If it&rsquo;s of interest, we&rsquo;d be glad to walk you through the full flow, including the simple order view your team would use. Just reply to this email.</p>
              <p style="margin:0;font-family:${FONT};font-size:15px;line-height:24px;color:#3d3a35;">The Booster team</p>
            </td>
          </tr>
        </table>
        <!-- Footer -->
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
          <tr>
            <td style="padding:24px 40px 8px 40px;font-family:${FONT};font-size:12px;line-height:19px;color:#8a847a;text-align:center;">
              You&rsquo;re receiving this one-off email because we thought Booster might suit ${esc(b.name)}.
              If you&rsquo;d rather not hear from us, <a href="${esc(unsubscribe)}" style="color:#8a847a;text-decoration:underline;">unsubscribe</a> or reply &ldquo;unsubscribe&rdquo; and we won&rsquo;t contact you again.
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;font-family:${FONT};font-size:12px;line-height:19px;color:#a39d92;text-align:center;">
              ${esc(config.companyAddress)}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function renderEmailText(b: Boutique, config: SiteConfig): string {
  const copy = sections(b);
  const screens: Screen[] = ["cart", "checkout", "tracking"];
  return `Subject: ${subjectLine(b)}

Hi ${b.name} team,

We put together a short concept of your checkout with Booster built in: a flat £25 option for customers who want their order delivered within the hour.

With your boutique in ${b.neighbourhood}, we thought you might like to see how it would look. Each link below opens a clickable demo styled for ${b.name}.

${screens
  .map((s) => `${copy[s].label}\n${copy[s].title}\n${copy[s].body}\nSee it live: ${demoLink(config, b, `email-${s}`)}`)
  .join("\n\n")}

If it's of interest, we'd be glad to walk you through the full flow, including the simple order view your team would use. Just reply to this email.

The Booster team

--
You're receiving this one-off email because we thought Booster might suit ${b.name}. If you'd rather not hear from us, reply "unsubscribe" and we won't contact you again.
${config.companyAddress}
`;
}
