import { z } from 'zod'

export const signupSchema = z
  .object({
    nickname: z.string().min(2, '닉네임은 최소 2자 이상 입력해주세요.'),
    email: z.string().email('유효한 이메일을 입력해주세요.'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상 입력해야 합니다.'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: '비밀번호가 일치하지 않습니다.',
  })
