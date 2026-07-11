import { MediaItem, MediaStatus } from '@/types'

export const STATUS_LABELS: Record<MediaStatus, string> = {
  watching:      'Assistindo',
  plan_to_watch: 'Quero Assistir',
  on_hold:       'Pausado',
  up_to_date:    'Em Dia',
  completed:     'Concluído',
}

const STATUS_ORDER: MediaStatus[] = ['watching', 'up_to_date', 'plan_to_watch', 'on_hold', 'completed']

export type SectionRow =
  | { type: 'header'; label: string; status: MediaStatus }
  | { type: 'cards'; items: MediaItem[]; key: string }

export function buildSectionRows(items: MediaItem[], numColumns: number): SectionRow[] {
  const rows: SectionRow[] = []

  for (const status of STATUS_ORDER) {
    const group = items.filter((i) => i.status === status)
    if (group.length === 0) continue

    rows.push({ type: 'header', label: STATUS_LABELS[status], status })

    for (let i = 0; i < group.length; i += numColumns) {
      rows.push({ type: 'cards', items: group.slice(i, i + numColumns), key: `${status}-${i}` })
    }
  }

  return rows
}
