export interface VoiceClientConfig {
  onStatusChange: (status: VoiceStatus) => void;
  onTranscript: (transcript: TranscriptEntry) => void;
  onError: (error: string) => void;
  onFunctionCall?: (name: string, args: Record<string, unknown>) => void;
}

export type VoiceStatus =
  | "idle"
  | "connecting"
  | "connected"
  | "listening"
  | "speaking"
  | "processing"
  | "error";

export interface TranscriptEntry {
  role: "user" | "assistant" | "system";
  text: string;
  timestamp: Date;
}

// Function call handling
interface FunctionCallEvent {
  call_id: string;
  name: string;
  arguments: string;
}

export class VoiceClient {
  private pc: RTCPeerConnection | null = null;
  private dc: RTCDataChannel | null = null;
  private audioElement: HTMLAudioElement | null = null;
  private localStream: MediaStream | null = null;
  private config: VoiceClientConfig;
  private isConnected = false;
  private pendingFunctionCalls: Map<string, FunctionCallEvent> = new Map();
  private inactivityTimer: NodeJS.Timeout | null = null;
  private readonly INACTIVITY_TIMEOUT = 60 * 1000; // 1 minute

  constructor(config: VoiceClientConfig) {
    this.config = config;
  }

  private resetInactivityTimer(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
    }
    this.inactivityTimer = setTimeout(() => {
      console.log("Disconnecting due to inactivity (1 minute of silence)");
      this.disconnect();
    }, this.INACTIVITY_TIMEOUT);
  }

  async connect(): Promise<void> {
    console.log("[VoiceClient] 🎤 connect() called");
    this.config.onStatusChange("connecting");

    try {
      // Get ephemeral token from our API
      console.log("[VoiceClient] Step 1: Requesting ephemeral token from /api/realtime");
      const tokenResponse = await fetch("/api/realtime", {
        method: "POST",
      });

      console.log("[VoiceClient] Token response status:", tokenResponse.status, tokenResponse.ok);
      if (!tokenResponse.ok) {
        const error = await tokenResponse.json();
        console.error("[VoiceClient] ❌ Token request failed:", error);
        throw new Error(error.error || "Failed to get session token");
      }

      const { client_secret } = await tokenResponse.json();
      console.log("[VoiceClient] ✅ Token received, client_secret exists:", !!client_secret?.value);

      // Create peer connection
      console.log("[VoiceClient] Step 2: Creating RTCPeerConnection");
      this.pc = new RTCPeerConnection();

      // Add connection state listeners
      this.pc.onconnectionstatechange = () => {
        console.log("[VoiceClient] 🔌 PeerConnection state:", this.pc?.connectionState);
        if (this.pc?.connectionState === "failed" || this.pc?.connectionState === "disconnected") {
          console.error("[VoiceClient] ❌ PeerConnection failed/disconnected");
        }
      };

      this.pc.oniceconnectionstatechange = () => {
        console.log("[VoiceClient] 🧊 ICE connection state:", this.pc?.iceConnectionState);
      };

      // Set up audio element for playback
      console.log("[VoiceClient] Step 3: Creating audio element");
      this.audioElement = document.createElement("audio");
      this.audioElement.autoplay = true;

      // Handle incoming audio from OpenAI
      this.pc.ontrack = (event) => {
        console.log("[VoiceClient] 📡 Received audio track:", event.streams.length, "streams");
        if (this.audioElement && event.streams[0]) {
          this.audioElement.srcObject = event.streams[0];
          console.log("[VoiceClient] ✅ Audio track attached to audio element");
          this.config.onStatusChange("connected");
        }
      };

      // Get microphone access
      console.log("[VoiceClient] Step 4: Requesting microphone access");
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 24000,
        },
      });
      console.log("[VoiceClient] ✅ Microphone access granted, tracks:", this.localStream.getTracks().length);

      // Add local audio track to peer connection
      console.log("[VoiceClient] Step 5: Adding local audio tracks to peer connection");
      this.localStream.getTracks().forEach((track) => {
        this.pc!.addTrack(track, this.localStream!);
        console.log("[VoiceClient] Added track:", track.kind, track.id);
      });

      // Create data channel for events
      console.log("[VoiceClient] Step 6: Creating data channel");
      this.dc = this.pc.createDataChannel("oai-events");
      this.setupDataChannel();

      // Create and set local description
      console.log("[VoiceClient] Step 7: Creating SDP offer");
      const offer = await this.pc.createOffer();
      console.log("[VoiceClient] Offer created, setting local description");
      await this.pc.setLocalDescription(offer);
      console.log("[VoiceClient] ✅ Local description set");

      // Send offer to OpenAI
      console.log("[VoiceClient] Step 8: Sending SDP offer to OpenAI");
      const sdpResponse = await fetch(
        "https://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-12-17",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${client_secret.value}`,
            "Content-Type": "application/sdp",
          },
          body: offer.sdp,
        }
      );

      console.log("[VoiceClient] SDP response status:", sdpResponse.status, sdpResponse.ok);
      if (!sdpResponse.ok) {
        const errorText = await sdpResponse.text();
        console.error("[VoiceClient] ❌ SDP response failed:", errorText);
        throw new Error(`Failed to connect to OpenAI Realtime: ${sdpResponse.status} ${errorText}`);
      }

      // Set remote description
      console.log("[VoiceClient] Step 9: Setting remote description");
      const answerSdp = await sdpResponse.text();
      await this.pc.setRemoteDescription({
        type: "answer",
        sdp: answerSdp,
      });
      console.log("[VoiceClient] ✅ Remote description set");

      this.isConnected = true;
      this.resetInactivityTimer(); // Start inactivity timer when connected
      console.log("[VoiceClient] ✅✅✅ Connection successful! isConnected:", this.isConnected);
      this.config.onStatusChange("connected");
    } catch (error) {
      console.error("[VoiceClient] ❌❌❌ Connection error:", error);
      console.error("[VoiceClient] Error stack:", error instanceof Error ? error.stack : "No stack");
      this.config.onError(
        error instanceof Error ? error.message : "Connection failed"
      );
      this.config.onStatusChange("error");
      this.disconnect();
    }
  }

  private setupDataChannel(): void {
    if (!this.dc) {
      console.log("[VoiceClient] ⚠️ setupDataChannel called but dc is null");
      return;
    }

    console.log("[VoiceClient] Setting up data channel listeners");
    this.dc.onopen = () => {
      console.log("[VoiceClient] ✅ Data channel opened, readyState:", this.dc?.readyState);
    };

    this.dc.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("[VoiceClient] 📨 Data channel message received:", message.type);
        this.handleServerEvent(message);
      } catch (error) {
        console.error("[VoiceClient] ❌ Failed to parse server event:", error);
      }
    };

    this.dc.onerror = (error) => {
      console.error("[VoiceClient] ❌ Data channel error:", error);
    };

    this.dc.onclose = () => {
      console.log("[VoiceClient] ⚠️ Data channel closed, readyState:", this.dc?.readyState);
      if (this.isConnected) {
        console.log("[VoiceClient] Still connected, setting status to idle");
        this.config.onStatusChange("idle");
      }
    };
  }

  private async handleServerEvent(event: Record<string, unknown>): Promise<void> {
    const type = event.type as string;

    switch (type) {
      case "input_audio_buffer.speech_started":
        this.resetInactivityTimer(); // User started speaking
        this.config.onStatusChange("listening");
        break;

      case "input_audio_buffer.speech_stopped":
        this.config.onStatusChange("connected");
        break;

      case "response.audio.started":
        this.resetInactivityTimer(); // Assistant started speaking
        this.config.onStatusChange("speaking");
        break;

      case "response.audio.done":
        this.config.onStatusChange("connected");
        break;

      case "conversation.item.input_audio_transcription.completed":
        if (event.transcript) {
          this.config.onTranscript({
            role: "user",
            text: event.transcript as string,
            timestamp: new Date(),
          });
        }
        break;

      case "response.audio_transcript.done":
        if (event.transcript) {
          this.config.onTranscript({
            role: "assistant",
            text: event.transcript as string,
            timestamp: new Date(),
          });
        }
        break;

      // Function calling events
      case "response.function_call_arguments.start":
        // A function call is starting
        this.config.onStatusChange("processing");
        break;

      case "response.output_item.done":
        // Check if this is a function call output
        const item = event.item as Record<string, unknown> | undefined;
        if (item?.type === "function_call") {
          const callId = item.call_id as string;
          const name = item.name as string;
          const args = item.arguments as string;
          
          await this.executeFunctionCall(callId, name, args);
        }
        break;

      case "error":
        console.error("Server error:", event);
        this.config.onError(
          (event.error as { message?: string })?.message || "Server error"
        );
        break;
    }
  }

  private async handleFunctionCall(event: Record<string, unknown>): Promise<void> {
    const callId = event.call_id as string;
    const name = event.name as string;
    const args = event.arguments as string;

    if (callId && name && args) {
      await this.executeFunctionCall(callId, name, args);
    }
  }

  private async executeFunctionCall(
    callId: string,
    name: string,
    argsString: string
  ): Promise<void> {
    console.log(`Executing function: ${name}`, argsString);
    
    // Notify UI about function call
    this.config.onFunctionCall?.(name, JSON.parse(argsString || "{}"));
    
    let result: unknown;

    try {
      const args = JSON.parse(argsString || "{}");

      switch (name) {
        case "search_knowledge":
          result = await this.callSearchAPI(args);
          break;

        case "capture_contact":
          result = await this.callContactAPI(args);
          break;

        // book_meeting disabled - saved in src/lib/future-tools.ts
        // case "book_meeting":
        //   result = await this.callCalendarAPI(args);
        //   break;

        default:
          result = { error: `Unknown function: ${name}` };
      }
    } catch (error) {
      console.error(`Function ${name} failed:`, error);
      result = { error: `Function failed: ${error}` };
    }

    // Send function result back to the model
    this.sendFunctionResult(callId, result);
  }

  private async callSearchAPI(args: { query: string; category?: string }): Promise<unknown> {
    const response = await fetch("/api/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });

    const data = await response.json();
    return { content: data.formatted || "No information found." };
  }

  private async callContactAPI(args: Record<string, unknown>): Promise<unknown> {
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...args, source: "voice_assistant" }),
    });

    const data = await response.json();
    return {
      success: data.success,
      message: data.message || "Contact information captured.",
    };
  }

  private async callCalendarAPI(args: Record<string, unknown>): Promise<unknown> {
    const response = await fetch("/api/calendar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(args),
    });

    const data = await response.json();
    return {
      booking_link: data.booking_link,
      message: data.message,
    };
  }

  private sendFunctionResult(callId: string, result: unknown): void {
    if (!this.dc || this.dc.readyState !== "open") {
      console.error("Data channel not open, cannot send function result");
      return;
    }

    // Send the function call output
    const outputEvent = {
      type: "conversation.item.create",
      item: {
        type: "function_call_output",
        call_id: callId,
        output: JSON.stringify(result),
      },
    };

    this.dc.send(JSON.stringify(outputEvent));

    // Trigger response generation
    const responseEvent = {
      type: "response.create",
    };

    this.dc.send(JSON.stringify(responseEvent));
    
    this.config.onStatusChange("connected");
  }

  disconnect(): void {
    console.log("[VoiceClient] 🔌 disconnect() called");
    console.trace("[VoiceClient] Disconnect call stack:");
    this.isConnected = false;

    // Clear inactivity timer
    if (this.inactivityTimer) {
      console.log("[VoiceClient] Clearing inactivity timer");
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    if (this.localStream) {
      console.log("[VoiceClient] Stopping local stream tracks");
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }

    if (this.dc) {
      console.log("[VoiceClient] Closing data channel, readyState:", this.dc.readyState);
      this.dc.close();
      this.dc = null;
    }

    if (this.pc) {
      console.log("[VoiceClient] Closing peer connection, state:", this.pc.connectionState);
      this.pc.close();
      this.pc = null;
    }

    if (this.audioElement) {
      console.log("[VoiceClient] Clearing audio element");
      this.audioElement.srcObject = null;
      this.audioElement = null;
    }

    this.pendingFunctionCalls.clear();
    console.log("[VoiceClient] ✅ Disconnect complete");
    this.config.onStatusChange("idle");
  }

  isActive(): boolean {
    return this.isConnected;
  }
}
