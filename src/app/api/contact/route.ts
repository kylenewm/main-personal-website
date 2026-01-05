import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import nodemailer from "nodemailer";
import { logger } from "@/lib/logger";

interface ContactSubmission {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  message: string;
  interest?: string;
  timestamp: string;
  source: "voice_assistant" | "form";
}

// Store contacts locally in dev; skip file writes on Vercel (read-only FS)
const CONTACTS_FILE = path.join(process.cwd(), "data", "contacts.json");
const isProdReadonly = !!process.env.VERCEL;

function ensureDataDirectory() {
  if (isProdReadonly) return;
  const dataDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadContacts(): ContactSubmission[] {
  if (isProdReadonly) return [];
  try {
    ensureDataDirectory();
    if (fs.existsSync(CONTACTS_FILE)) {
      const data = fs.readFileSync(CONTACTS_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (error) {
    console.error("Error loading contacts:", error);
  }
  return [];
}

function saveContacts(contacts: ContactSubmission[]) {
  if (isProdReadonly) return;
  ensureDataDirectory();
  fs.writeFileSync(CONTACTS_FILE, JSON.stringify(contacts, null, 2));
}

// Send email notification via Gmail
async function sendEmailNotification(contact: ContactSubmission) {
  console.log("=== NEW CONTACT SUBMISSION ===");
  console.log(`Name: ${contact.name}`);
  console.log(`Email: ${contact.email || "Not provided"}`);
  console.log(`Phone: ${contact.phone || "Not provided"}`);
  console.log(`Company: ${contact.company || "Not provided"}`);
  console.log(`Interest: ${contact.interest || "Not specified"}`);
  console.log(`Message: ${contact.message}`);
  console.log(`Time: ${contact.timestamp}`);
  console.log("==============================");

  // Send email via Gmail
  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      const contactMethod = contact.email
        ? `Email: ${contact.email}`
        : `Phone: ${contact.phone}`;

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: "kylenewman1214@gmail.com",
        subject: `Portfolio Contact: ${contact.name}`,
        text: `
New contact from your portfolio:

Name: ${contact.name}
${contactMethod}
Company: ${contact.company || "Not provided"}
Interest: ${contact.interest || "Not specified"}

Message:
${contact.message}

---
Received: ${new Date(contact.timestamp).toLocaleString()}
Source: ${contact.source}
        `.trim(),
      });

      logger.contact.emailSent();
    } catch (error) {
      logger.contact.emailFailed(error instanceof Error ? error.message : "Unknown error");
      // Don't fail the request if email fails
    }
  }

  return true;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      message,
      interest,
      source = "voice_assistant",
    } = body;

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    // Validate at least one contact method
    if (!email && !phone) {
      return NextResponse.json(
        { error: "Either email or phone number is required" },
        { status: 400 }
      );
    }

    // Validate email format if provided
    if (email && !email.includes("@")) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Validate phone format if provided (at least 10 digits)
    if (phone && phone.replace(/\D/g, "").length < 10) {
      return NextResponse.json(
        { error: "Phone number must have at least 10 digits" },
        { status: 400 }
      );
    }

    // Simple deduplication - check for same name+message within 30 seconds
    const contacts = loadContacts();
    const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
    const isDuplicate = contacts.some(
      (c) =>
        c.name === name && c.message === message && c.timestamp > thirtySecondsAgo
    );

    if (isDuplicate) {
      console.log("Duplicate submission detected, skipping");
      return NextResponse.json({
        success: true,
        message: "Contact information already captured.",
      });
    }

    // Create contact submission
    const contact: ContactSubmission = {
      name,
      email,
      phone,
      company,
      message,
      interest,
      timestamp: new Date().toISOString(),
      source,
    };

    logger.contact.submitted(!!email, !!phone);

    // Save locally only in dev; skip in Vercel (read-only FS)
    if (!isProdReadonly) {
      try {
        contacts.push(contact);
        saveContacts(contacts);
      } catch {
        // File save is optional, don't log every time
      }
    }

    // Send email notification
    await sendEmailNotification(contact);

    return NextResponse.json({
      success: true,
      message: "Contact information captured successfully.",
    });
  } catch (error) {
    logger.error("Contact capture failed", {
      component: "contact",
      error: error instanceof Error ? error.message : "Unknown error"
    });
    return NextResponse.json(
      { error: "Failed to capture contact information" },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve contacts (for Kyle to check)
export async function GET(request: NextRequest) {
  // Simple auth check - in production, use proper authentication
  const authHeader = request.headers.get("authorization");
  const expectedKey = process.env.ADMIN_KEY;

  if (expectedKey && authHeader !== `Bearer ${expectedKey}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const contacts = loadContacts();
  return NextResponse.json({ contacts });
}
