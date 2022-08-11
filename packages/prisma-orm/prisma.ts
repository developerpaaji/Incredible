/**
 * Instantiates a single instance PrismaClient and save it on the global object.
 * @link https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
import { PrismaClient } from '@prisma/client'

const prismaGlobal = global as typeof global & {
	prisma?: PrismaClient
}

const prisma: PrismaClient =
	prismaGlobal.prisma ||
	new PrismaClient({
		datasources: {
			db: { url: process.env.DATABASE_URL },
		},
		// log:
		// 	process.env.NODE_ENV === 'development' || !process.env.NODE_ENV
		// 		? ['query', 'error', 'warn']
		// 		: ['error'],
	})

if (process.env.NODE_ENV !== 'production') {
	prismaGlobal.prisma = prisma
}

export default prisma
