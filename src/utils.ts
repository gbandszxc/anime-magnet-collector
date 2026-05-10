import { CONFIG, type Config } from "./config";

interface UtilsDeps {
  config?: Config;
}

/**
 * 工具函数集合。
 * 通过参数注入依赖（config 等），便于在测试中替换为 mock。
 */
export function createUtils({ config = CONFIG }: UtilsDeps = {}): {
  log(...args: unknown[]): void;
  // 在此添加更多工具函数签名
} {
  function log(...args: unknown[]): void {
    if (config.debug) console.log("[Anime Magnet Collector]", ...args);
  }

  // TODO: 在此添加你的工具函数

  return { log };
}

// 通过 ReturnType 推导类型，新增函数时只需更新实现，无需同步维护接口
export type Utils = ReturnType<typeof createUtils>;
