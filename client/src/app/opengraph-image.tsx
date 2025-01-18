import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "WASPY - AI-powered WhatsApp Support Platform";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to right, #9333EA, #3B82F6, #14B8A6)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "Arial",
          color: "white",
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: "bold",
            marginBottom: 24,
          }}
        >
          WASPY
        </div>
        <div
          style={{
            fontSize: 36,
            textAlign: "center",
            maxWidth: "80%",
          }}
        >
          AI-powered WhatsApp Support Platform
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
