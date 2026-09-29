import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/authOptions";
import { prisma } from "@/lib/prisma";
import { encrypt } from "@/lib/crypto/encryption";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Organizer account not found" },
        { status: 404 }
      );
    }

    const config = await prisma.smtpConfig.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    if (!config) {
      return NextResponse.json({
        success: true,
        configured: false,
        config: null,
      });
    }

    return NextResponse.json({
      success: true,
      configured: true,
      config: {
        id: config.id,
        host: config.host,
        port: config.port,
        secure: config.secure,
        username: config.username,
        senderName: config.senderName,
        senderEmail: config.senderEmail,
        // Never return the encrypted password.
      },
    });
  } catch (error) {
    console.error("Failed to fetch SMTP config:", error);

    return NextResponse.json(
      { error: "Failed to fetch SMTP configuration" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Organizer account not found" },
        { status: 404 }
      );
    }

    const body = await req.json();

    const host =
      typeof body.host === "string"
        ? body.host.trim()
        : "";

    const port = Number(body.port);

    const secure = Boolean(body.secure);

    const username =
      typeof body.username === "string"
        ? body.username.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const senderName =
      typeof body.senderName === "string"
        ? body.senderName.trim()
        : "";

    const senderEmail =
      typeof body.senderEmail === "string"
        ? body.senderEmail.trim()
        : "";

    if (
      !host ||
      !Number.isInteger(port) ||
      port < 1 ||
      port > 65535 ||
      !username ||
      !password ||
      !senderName ||
      !senderEmail
    ) {
      return NextResponse.json(
        {
          error:
            "host, valid port, username, password, senderName and senderEmail are required",
        },
        { status: 400 }
      );
    }

    const encryptedPassword = encrypt(password);

    const existingConfig = await prisma.smtpConfig.findFirst({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: "desc",
      },
    });

    let config;

    if (existingConfig) {
      config = await prisma.smtpConfig.update({
        where: {
          id: existingConfig.id,
        },
        data: {
          host,
          port,
          secure,
          username,
          password: encryptedPassword,
          senderName,
          senderEmail,
        },
      });
    } else {
      config = await prisma.smtpConfig.create({
        data: {
          userId: user.id,
          host,
          port,
          secure,
          username,
          password: encryptedPassword,
          senderName,
          senderEmail,
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: "SMTP configuration saved successfully",
      config: {
        id: config.id,
        host: config.host,
        port: config.port,
        secure: config.secure,
        username: config.username,
        senderName: config.senderName,
        senderEmail: config.senderEmail,
      },
    });
  } catch (error) {
    console.error("Failed to save SMTP config:", error);

    return NextResponse.json(
      { error: "Failed to save SMTP configuration" },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Organizer account not found" },
        { status: 404 }
      );
    }

    await prisma.smtpConfig.deleteMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json({
      success: true,
      message: "SMTP configuration deleted successfully",
    });
  } catch (error) {
    console.error("Failed to delete SMTP config:", error);

    return NextResponse.json(
      { error: "Failed to delete SMTP configuration" },
      { status: 500 }
    );
  }
}
