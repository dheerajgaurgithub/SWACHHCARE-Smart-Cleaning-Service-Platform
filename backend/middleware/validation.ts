import type { Request, Response, NextFunction } from "express"
import type { z } from "zod"

export const validateRequest = (schema: z.ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      })
      req.body = validated.body
      next()
    } catch (error: any) {
      res.status(400).json({ error: error.errors })
    }
  }
}
