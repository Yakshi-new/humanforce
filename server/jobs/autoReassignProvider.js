import cron from 'node-cron'
import Booking from '../models/Booking.js'
import User from '../models/User.js'
import ActivityLog from '../models/ActivityLog.js'

/**
 * Auto-Reassign Provider Job
 * Runs every 5 minutes.
 * If a booking has been in 'Pending' status for more than 30 minutes
 * without provider acceptance, it reassigns to a different active provider.
 */
export const startAutoReassignJob = () => {
  cron.schedule('*/5 * * * *', async () => {
    console.log('[AutoReassign] Checking for stale pending bookings...')
    try {
      const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000)

      // Find all Pending bookings where neither createdAt nor lastReassignedAt
      // is within the last 30 minutes (i.e., provider had 30 min and didn't accept)
      const staleBookings = await Booking.find({
        status: 'Pending',
        $or: [
          { lastReassignedAt: null, createdAt: { $lt: thirtyMinutesAgo } },
          { lastReassignedAt: { $lt: thirtyMinutesAgo } }
        ]
      }).populate('provider', 'firstName lastName email')

      if (staleBookings.length === 0) {
        console.log('[AutoReassign] No stale bookings found.')
        return
      }

      console.log(`[AutoReassign] Found ${staleBookings.length} stale booking(s). Reassigning...`)

      // Get all active providers
      const allProviders = await User.find({ role: 'provider', status: 'Active' })

      for (const booking of staleBookings) {
        const currentProviderId = booking.provider ? booking.provider._id.toString() : null

        // Find a different provider (exclude the currently assigned one)
        const otherProviders = allProviders.filter(p => p._id.toString() !== currentProviderId)

        if (otherProviders.length === 0) {
          // No other provider available — keep existing or leave unassigned
          console.log(`[AutoReassign] No alternative providers available for booking ${booking.bookingId}`)
          continue
        }

        // Pick a random alternate provider
        const newProvider = otherProviders[Math.floor(Math.random() * otherProviders.length)]

        const previousProviderName = booking.provider
          ? `${booking.provider.firstName} ${booking.provider.lastName}`
          : 'Unassigned'

        booking.provider = newProvider._id
        // Reset the createdAt timestamp so this booking doesn't get reassigned again immediately
        booking.lastReassignedAt = new Date()
        await booking.save()

        console.log(
          `[AutoReassign] Booking ${booking.bookingId}: reassigned from ${previousProviderName} → ${newProvider.firstName} ${newProvider.lastName}`
        )

        // Log in activity
        try {
          await ActivityLog.create({
            userId: newProvider._id,
            email: newProvider.email,
            name: `${newProvider.firstName} ${newProvider.lastName}`,
            role: 'system',
            action: 'Booking Status Update',
            details: `Auto-reassigned booking ${booking.bookingId} from ${previousProviderName} after 30-min no-response timeout`
          })
        } catch (logErr) {
          console.error('[AutoReassign] Failed to log:', logErr)
        }
      }
    } catch (err) {
      console.error('[AutoReassign] Job error:', err)
    }
  })

  console.log('[AutoReassign] Auto-reassign cron job started (runs every 5 minutes).')
}
