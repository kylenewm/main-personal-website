// Tools saved for future implementation
// These are not currently active but can be re-enabled when ready

/**
 * Book Meeting Tool - for calendar integration
 * 
 * To enable:
 * 1. Set up Cal.com or Calendly
 * 2. Add CALENDAR_BOOKING_LINK env var
 * 3. Add this tool back to /api/realtime/route.ts tools array
 * 4. Update system prompt to mention scheduling
 */
export const bookMeetingTool = {
  type: "function",
  name: "book_meeting",
  description: "Help the visitor schedule a meeting with Kyle. Use this when someone wants to book time, schedule a call, or set up a meeting.",
  parameters: {
    type: "object",
    properties: {
      preferred_timeframe: {
        type: "string",
        description: "When they'd like to meet (e.g., 'next week', 'tomorrow afternoon', 'asap')",
      },
      meeting_type: {
        type: "string",
        enum: ["intro_call", "technical_discussion", "opportunity_discussion"],
        description: "Type of meeting: intro_call for general intro, technical_discussion for deep technical topics, opportunity_discussion for job/role discussions",
      },
    },
  },
};

/**
 * System prompt addition for book_meeting tool:
 * 
 * 3. **book_meeting**: Use when someone wants to schedule time
 *    - "Can I book a call?" → Use book_meeting to get the booking link
 *    - "I'd like to schedule a meeting" → Same
 *    - Share the booking link and offer to help with the meeting type
 */

