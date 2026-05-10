export interface Config {
  debug: boolean;
  // 在此添加项目级配置字段
}

// satisfies 在保留字面量类型的同时约束对象形状，
// 比显式类型标注（: Config）更精确，扩展字段时 IDE 提示更准确
export const CONFIG = {
  debug: true,
} satisfies Config;

export default CONFIG;
