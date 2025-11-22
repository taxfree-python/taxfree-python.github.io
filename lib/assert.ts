/**
 * アサーション関数
 * 条件が false の場合はエラーをスローする
 */
export function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
