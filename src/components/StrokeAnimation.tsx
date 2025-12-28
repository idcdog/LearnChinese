"use client";

import { useEffect, useRef } from "react";

type Props = {
  char: string;
  size?: number;
};

// hanzi-writer 的笔顺演示组件，客户端渲染
export default function StrokeAnimation({ char, size = 280 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let writer: {
      loopCharacterAnimation: () => void;
      pauseAnimation: () => void;
      hideCharacter: () => void;
    } | null = null;
    let mounted = true;

    (async () => {
      const HanziWriter = (await import("hanzi-writer")).default as unknown as {
        create: (
          el: HTMLElement,
          ch: string,
          opts: Record<string, unknown>,
        ) => { loopCharacterAnimation: () => void; pauseAnimation: () => void; hideCharacter: () => void };
      };
      if (!HanziWriter || !containerRef.current || !mounted) return;
      writer = HanziWriter.create(containerRef.current, char, {
        width: size,
        height: size,
        showOutline: true,
        padding: 10,
        strokeAnimationSpeed: 1.1,
        delayBetweenStrokes: 200,
        radicalColor: "#06b6d4",
      });
      writer.loopCharacterAnimation();
    })();

    return () => {
      mounted = false;
      writer?.pauseAnimation();
      writer?.hideCharacter();
    };
  }, [char, size]);

  return <div ref={containerRef} className="mx-auto" />;
}
