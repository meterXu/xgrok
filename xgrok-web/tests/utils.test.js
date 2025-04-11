import { coverEnum } from '@/utils/index.js';
import {describe,it,expect} from "vitest";

describe('coverEnum function', () => {

    it('当枚举类型和值存在时，应返回枚举键', () => {
        expect(coverEnum('status', 1)).toBe('启用');
    });

    it('当值在枚举类型中不存在时，应返回 null', () => {
        expect(coverEnum('status', 2)).toBeNull();
    });

    it('当枚举类型不存在时，应返回 null', () => {
        expect(coverEnum('xxxxx', 1)).toBeNull();
    });
});
