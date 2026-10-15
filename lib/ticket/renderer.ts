import sharp, { type OverlayOptions } from "sharp";
import QRCode from "qrcode";
import { TemplatePlaceholder } from "@/types";

interface ParticipantData {
    id: string;
    name: string;
    email: string;
    role: string;
    institution?: string | null;
    teamName: string;
    teamNumber?: number | null;
}

interface RenderOptions {
    width: number;
    height: number;
    baseImageUrl: string;
    placeholders: TemplatePlaceholder[];
    participant: ParticipantData;
    eventId: string;
}

function getValue(
    field: TemplatePlaceholder["field"],
    participant: ParticipantData,
    eventId: string
): string {
    switch (field) {
        case "participantName":
            return participant.name;

        case "teamName":
            return participant.teamName;

        case "role":
            return participant.role;

        case "institution":
            return participant.institution || "Independent Hacker";

        case "teamNumber":
            return participant.teamNumber != null
                ? `TABLE #${participant.teamNumber}`
                : "";

        case "qrCode":
            return `${eventId}:${participant.id}`;

        default:
            return "";
    }
}

function escapeXml(value: string): string {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&apos;");
}

export async function renderTicket({
    width,
    height,
    baseImageUrl,
    placeholders,
    participant,
    eventId,
}: RenderOptions): Promise<Buffer> {
    let image = sharp(Buffer.from(
        baseImageUrl.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
    ));

    const layers: OverlayOptions[] = [];

    for (const placeholder of placeholders) {
        if (placeholder.field === "qrCode") {
            const qrPayload = getValue(
                "qrCode",
                participant,
                eventId
            );

            const qrSize = placeholder.width || 110;

            const qrDataUrl = await QRCode.toDataURL(qrPayload, {
                width: qrSize,
                margin: 0,
                errorCorrectionLevel: "M",
            });

            const qrBuffer = Buffer.from(
                qrDataUrl.replace(/^data:image\/png;base64,/, ""),
                "base64"
            );

            layers.push({
                input: qrBuffer,
                left: Math.round(placeholder.x),
                top: Math.round(placeholder.y),
            });

            continue;
        }

        let value = getValue(
            placeholder.field,
            participant,
            eventId
        );

        if (placeholder.textTransform === "uppercase") {
            value = value.toUpperCase();
        }

        if (placeholder.textTransform === "capitalize") {
            value = value.replace(/\b\w/g, (char) =>
                char.toUpperCase()
            );
        }

        const fontWeight =
            placeholder.fontWeight === "800"
                ? "800"
                : placeholder.fontWeight;

        const fontFamily =
            placeholder.fontFamily || "Arial";

        const textSvg = `
      <svg width="${width}" height="${height}">
        <style>
          .text {
            font-family: ${fontFamily};
            font-size: ${placeholder.fontSize}px;
            font-weight: ${fontWeight};
            fill: ${placeholder.color};
          }
        </style>

        <text
          x="${placeholder.x}"
          y="${placeholder.y + placeholder.fontSize}"
          class="text"
          text-anchor="${placeholder.textAlign === "center"
                ? "middle"
                : placeholder.textAlign === "right"
                    ? "end"
                    : "start"
            }"
        >
          ${escapeXml(value)}
        </text>
      </svg>
    `;

        layers.push({
            input: Buffer.from(textSvg),
            left: 0,
            top: 0,
        });
    }

    image = image.resize(width, height);

    return image
        .composite(layers)
        .png()
        .toBuffer();
}   