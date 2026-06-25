import { auth } from '../auth'
import { redirect } from 'next/navigation'
import HomeContent from './_components/HomeContent'

export default async function Home() {
  const session = await auth()
  if (session) redirect('/encounters')

  return (
    <main style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <HomeContent />
    </main>
  )
}