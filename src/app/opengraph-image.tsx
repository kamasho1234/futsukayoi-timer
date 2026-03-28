import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "二日酔い回復タイマー - アルコール分解時間を自動計算";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0c0f14 0%, #1a1f2e 50%, #0c0f14 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
          }}
        >
          <div
            style={{
              fontSize: "80px",
              fontWeight: 800,
              color: "#c9a84c",
              letterSpacing: "0.1em",
            }}
          >
            二日酔い回復タイマー
          </div>
          <div
            style={{
              width: "200px",
              height: "2px",
              background: "linear-gradient(90deg, transparent, #c9a84c, transparent)",
            }}
          />
          <div
            style={{
              fontSize: "36px",
              fontWeight: 600,
              color: "#e8e6e1",
              letterSpacing: "0.05em",
            }}
          >
            アルコール分解時間を自動計算
          </div>
          <div
            style={{
              fontSize: "22px",
              color: "#8a8680",
              marginTop: "8px",
            }}
          >
            飲酒量から回復時間がわかる無料Webアプリ
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
