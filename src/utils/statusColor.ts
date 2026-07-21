import { MediaStatus } from '@/types'
import { colors } from '@/theme'

export function statusColor(status: MediaStatus): string {
  switch (status) {
    case 'watching': return colors.watching
    case 'plan_to_watch': return colors.planned
    case 'on_hold': return colors.paused
    case 'up_to_date': return colors.upToDate
    case 'completed': return colors.completed
  }
}
