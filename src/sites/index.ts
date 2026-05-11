import { dmhyAdapter } from "./dmhy";
import { anonekoAdapter } from "./anoneko";
import { nyaaAdapter } from "./nyaa";
import type { SiteAdapter } from "./types";

export const adapters: SiteAdapter[] = [dmhyAdapter, anonekoAdapter, nyaaAdapter];

export function findAdapter(): SiteAdapter | undefined {
  const url = window.location.href;
  return adapters.find(a =>
    a.matchPatterns.some(pattern => {
      const regex = new RegExp("^" + pattern.replace(/\*/g, ".*") + "$");
      return regex.test(url);
    })
  );
}
