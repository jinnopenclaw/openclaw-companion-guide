import Topbar from './Topbar'
import Sidebar from './Sidebar'
import AppClient from './AppClient'

interface SiteLayoutProps {
  children: React.ReactNode
  hasPaid?: boolean
}

export default function SiteLayout({ children, hasPaid = false }: SiteLayoutProps) {
  return (
    <>
      <Topbar />
      <div className="container">
        <Sidebar hasPaid={hasPaid} />
        {children}
      </div>
      <AppClient />
    </>
  )
}
