import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
})

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
})

export const createTenderSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  deadline: z.string().min(1, 'Deadline is required'),
})

export const evaluationSchema = z.object({
  bidId: z.string().min(1, 'Bid ID is required'),
  technicalScore: z.number().min(0).max(70),
  financialScore: z.number().min(0).max(30),
  remarks: z.string().optional(),
})
