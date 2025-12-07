import { NextRequest, NextResponse } from "next/server";

// Calendar booking endpoint
// Currently returns a booking link - can be upgraded to full Cal.com/Calendly API integration

// Configure your booking link here
const BOOKING_LINK = process.env.CALENDAR_BOOKING_LINK || "https://cal.com/your-username";

interface BookingRequest {
  preferred_timeframe?: string;
  meeting_type?: "intro_call" | "technical_discussion" | "opportunity_discussion";
  name?: string;
  email?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as BookingRequest;
    const { preferred_timeframe, meeting_type, name, email } = body;

    // Log booking request for monitoring
    console.log("=== BOOKING REQUEST ===");
    console.log(`Preferred time: ${preferred_timeframe || "Not specified"}`);
    console.log(`Meeting type: ${meeting_type || "Not specified"}`);
    console.log(`Name: ${name || "Not provided"}`);
    console.log(`Email: ${email || "Not provided"}`);
    console.log("=======================");

    // For now, return the booking link
    // In the future, this could:
    // - Query Cal.com API for available slots
    // - Create a booking directly
    // - Return specific available times

    const meetingTypeLabels: Record<string, string> = {
      intro_call: "30-minute Intro Call",
      technical_discussion: "Technical Deep Dive",
      opportunity_discussion: "Opportunity Discussion",
    };

    const response = {
      success: true,
      booking_link: BOOKING_LINK,
      meeting_type_label: meeting_type ? meetingTypeLabels[meeting_type] : "General Meeting",
      message: `You can book time with Kyle directly using this link: ${BOOKING_LINK}`,
      // Placeholder for future Cal.com integration
      available_slots: null as string[] | null,
    };

    // TODO: Cal.com API integration
    // if (process.env.CAL_COM_API_KEY) {
    //   const slots = await getAvailableSlots(preferred_timeframe);
    //   response.available_slots = slots;
    //   response.message = `Kyle has availability ${slots.join(', ')}. Or use the booking link.`;
    // }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Calendar error:", error);
    return NextResponse.json(
      { error: "Failed to process booking request" },
      { status: 500 }
    );
  }
}

// Health check / get booking link
export async function GET() {
  return NextResponse.json({
    booking_link: BOOKING_LINK,
    status: "active",
  });
}

