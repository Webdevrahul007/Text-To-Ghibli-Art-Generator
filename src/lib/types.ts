import { z } from 'zod';

export const formSchema = z.object({
  prompt: z.string().min(1, {
    message: 'Prompt is required',
  }).max(1000, {
    message: 'Prompt must be less than 1000 characters',
  }),
});

export type FormValues = z.infer<typeof formSchema>;

export interface GenerationResult {
  output: string[] | null;
  error?: string;
}
