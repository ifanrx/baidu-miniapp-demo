// 数据测试表
export const SCHEMA_TABLE = 'auto_maintable';
// 数据测试表 - 关联表字段
export const SCHEMA_TABLE_POINTER_COLUMN = 'pointer_test_order';

// 数据测试关联表
export const POINTER_TABLE = 'test_order';

// 使用 test_order 表已有的数据
const POINTER_ID_1 = '5bd96ab0528d854b0c76e3ff';
const POINTER_ID_2 = '5b8a901109e0850f24f13fbe';
export function getPointerIds() {
  return {
    pointer_id: POINTER_ID_1,
    pointer_id2: POINTER_ID_2,
  }
}

export const BAAS_ERROR_CODE = {
  USER_UNAUTHORIZED: 401
}