"use client";

import { useEffect } from "react";

// Loads Netlify Identity on the public site so invite / password-recovery
// email links (which land on the homepage with a token in the URL) work.
// After a login through the widget, send the user to the admin panel.
export default function IdentityRedirect() {
  useEffect(() => {
    const w = window as unknown as { netlifyIdentity?: { on: (ev: string, cb: () => void) => void; init: () => void } };
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (w.netlifyIdentity) {
        clearInterval(timer);
        w.netlifyIdentity.init();
        w.netlifyIdentity.on("login", () => {
          if (window.location.pathname === "/") window.location.href = "/admin";
        });
      } else if (tries > 40) {
        clearInterval(timer);
      }
    }, 250);
    return () => clearInterval(timer);
  }, []);
  return null;
}
