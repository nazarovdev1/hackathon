import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export const getCachedServerSession = () => getServerSession(authOptions)
