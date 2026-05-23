/**
 * Front-end avatar URL generator — mirrors server/utils/avatarHelper.js
 * Used for preview or when the server hasn't returned an avatar yet.
 *
 * Styles per role:
 *  customer → lorelei      (elegant illustrated face)
 *  provider → notionists   (clean professional face)
 *  admin    → glass        (bold icon)
 */

const ROLE_STYLES = {
  customer: 'lorelei',
  provider: 'notionists',
  admin: 'glass',
}

const ROLE_BG_COLORS = {
  customer: ['b6e3f4', 'c0aede', 'd1d4f9', 'ffd5dc', 'ffdfbf'],
  provider: ['6366f1', '8b5cf6', '06b6d4', '10b981', 'f59e0b'],
  admin: ['1e1b4b', '312e81', '3730a3'],
}

/**
 * @param {string} firstName
 * @param {string} lastName
 * @param {string} role - 'customer' | 'provider' | 'admin'
 * @returns {string} DiceBear v9 SVG avatar URL
 */
export function generateAvatarUrl(firstName = '', lastName = '', role = 'customer') {
  const style = ROLE_STYLES[role] || 'thumbs'
  const seed = encodeURIComponent(`${firstName}_${lastName}_${role}`)
  const bgColors = (ROLE_BG_COLORS[role] || ROLE_BG_COLORS.customer)
    .map(c => `backgroundColor[]=${c}`)
    .join('&')

  return `https://api.dicebear.com/9.x/${style}/svg?seed=${seed}&${bgColors}&radius=50`
}
