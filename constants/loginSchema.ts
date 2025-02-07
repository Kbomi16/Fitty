import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력해주세요.'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상 입력해야 합니다.'),
})
