import type { ReactNode } from "react";

/** A clean phone frame whose screen is exactly 390×844 CSS pixels. */
export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-[62px] bg-[#1a1a1a] p-[11px] shadow-[0_40px_70px_-30px_rgba(0,0,0,0.45),inset_0_0_0_1.5px_#3a3a3a]">
      <div className="relative h-[844px] w-[390px] overflow-hidden rounded-[52px] bg-white">
        {/* Status bar */}
        <div className="relative z-20 flex h-[50px] items-center justify-between px-8 pt-1 text-[15px] font-semibold text-black">
          <span className="tabular-nums">9:41</span>
          <span className="flex items-center gap-1.5" aria-hidden>
            <svg width="18" height="11" viewBox="0 0 18 11" fill="currentColor">
              <rect x="0" y="7" width="3" height="4" rx="1" />
              <rect x="5" y="5" width="3" height="6" rx="1" />
              <rect x="10" y="2.5" width="3" height="8.5" rx="1" />
              <rect x="15" y="0" width="3" height="11" rx="1" />
            </svg>
            <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
              <path d="M8 2.2c2.3 0 4.4.9 6 2.4l1.1-1.2A10.2 10.2 0 0 0 8 .5C5.3.5 2.8 1.5.9 3.4L2 4.6a8.6 8.6 0 0 1 6-2.4zm0 3.3c1.4 0 2.6.5 3.6 1.4l1.1-1.2A6.9 6.9 0 0 0 8 3.8c-1.8 0-3.4.7-4.7 1.9l1.1 1.2c1-.9 2.2-1.4 3.6-1.4zM8 8.8 6 7.4a3 3 0 0 1 4 0z" />
            </svg>
            <svg width="27" height="12" viewBox="0 0 27 12" fill="none">
              <rect x="0.5" y="0.5" width="23" height="11" rx="3.5" stroke="currentColor" opacity="0.4" />
              <rect x="2" y="2" width="20" height="8" rx="2" fill="currentColor" />
              <path d="M25 4v4c.8-.3 1.3-1.1 1.3-2S25.8 4.3 25 4z" fill="currentColor" opacity="0.5" />
            </svg>
          </span>
        </div>
        {/* Dynamic island */}
        <div className="absolute top-[11px] left-1/2 z-30 h-[34px] w-[122px] -translate-x-1/2 rounded-full bg-black" />
        <div className="h-[794px]">{children}</div>
        {/* Home indicator */}
        <div className="absolute bottom-[8px] left-1/2 z-30 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/85" />
      </div>
    </div>
  );
}
