import { resolveMapUrl } from '../lib/maps'

type ActionKind = 'call' | 'map' | 'web' | 'ticket'

const KIND_HINT: Record<ActionKind, string> = {
  call: 'Starts a phone call',
  map: 'Opens Maps',
  web: 'Opens in browser',
  ticket: 'Opens your tickets',
}

interface ActionButtonProps {
  kind: ActionKind
  label: string
  detail?: string
  href: string
}

export function ActionButton({ kind, label, detail, href }: ActionButtonProps) {
  const external = kind !== 'call'
  const resolvedHref = kind === 'map' ? resolveMapUrl(href) : href
  return (
    <a
      href={resolvedHref}
      className={`action-btn action-btn--${kind}`}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
    >
      <span className="action-btn-kind">{kind === 'call' ? 'Call' : kind === 'map' ? 'Map' : kind === 'ticket' ? 'Ticket' : 'Web'}</span>
      <span className="action-btn-text">
        <span className="action-btn-label">{label}</span>
        <span className="action-btn-detail">{detail ?? KIND_HINT[kind]}</span>
      </span>
    </a>
  )
}
