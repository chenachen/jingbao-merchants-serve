import { Prisma } from '@prisma/client'

export type UserPayload = Prisma.UserGetPayload<{ include: { role: true } }>
