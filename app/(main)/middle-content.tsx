"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import { useMiddleContent } from "@/providers/middle-content-provider";
import { ViolationType } from "@/types/violation";

const Map = dynamic(() => import("@/components/map"), { ssr: false });

type MiddleContentProps = {
  violations: ViolationType[];
};
const MiddleContent = ({ violations }: MiddleContentProps) => {
  const { middleContent } = useMiddleContent();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then(stream => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
      });
  }, [middleContent]);

  return (
    <div className="min-h-[500px] max-h-[500px] overflow-hidden">
      {middleContent === "map" ? (
        <Map violation={violations} />
      ) : (
        <video
          ref={videoRef}
          style={{
            transform: "scale(-1, 1)",
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        />
      )}
    </div>
  );
};

export default MiddleContent;
