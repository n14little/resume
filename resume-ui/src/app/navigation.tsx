'use client'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'

function Link({ href, title }: { href: string, title: string }) {
  const pathname = usePathname()
  return <NextLink href={href} className={`font-bold p-2 hover:bg-gray-100 ${pathname === href ? 'underline' : ''}`}>{title}</NextLink>
}

export default function Navigation() {
  return (
    <nav className="flex flex-row border-b-gray-200 border-b-2 gap-2 p-2 justify-center">
      <Link href="/contact-info" title="Contact info" />
      <Link href="/skills" title="Skills" />
      <Link href="/experience" title="Experience" />
      <Link href="/awards" title="Awards" />
      <Link href="/education" title="Education" />
      <Link href="/applications" title="Applications" />
    </nav>
  )
}
