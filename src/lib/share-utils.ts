import dayjs from 'dayjs'

export function buildShareMessage(
    title: string,
    productionDate: string | null,
) {
    const dateStr = productionDate
        ? dayjs(productionDate).format('DD MMMM YYYY')
        : 'TBD'

    return `Hallo guyss! 👋\nHari ini tanggal ${dateStr}, kita akan take konten:\n\n📹 *${title}*\n\ndi CWorld Arena.\nMohon bantuannya yaaaa..\n\nBest regards,\nKrisnanda`
}

export function getWhatsAppUrl(message: string): string {
    return `https://wa.me/?text=${encodeURIComponent(message)}`
}

export function getTelegramUrl(message: string): string {
    return `https://t.me/share/url?text=${encodeURIComponent(message)}`
}
