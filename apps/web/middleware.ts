import { auth } from './auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
    const isLoggedIn = !!req.auth
    const isAuthPage = req.nextUrl.pathname.startsWith('/api/auth')
    const isHomePage = req.nextUrl.pathname === '/'

    if (isAuthPage || isHomePage) return NextResponse.next()

    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/', req.nextUrl))
    }

    return NextResponse.next()
})

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}