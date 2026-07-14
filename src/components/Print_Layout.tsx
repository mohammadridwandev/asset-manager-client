import type { ReactNode } from "react";

import letterHead from "../assets/image/Header-Footer.webp";

type PrintLayoutProps = {
  children: ReactNode;
};

export default function Print_Layout({
  children,
}: PrintLayoutProps) {
  return (
    <div className="official-print-document">
      {/* Full A4 letterhead background */}
      <img
        src={letterHead}
        alt=""
        aria-hidden="true"
        className="official-print-letterhead"
      />

      {/* Dynamic document content */}
      <main className="official-print-content">
        {children}
      </main>
    </div>
  );
}