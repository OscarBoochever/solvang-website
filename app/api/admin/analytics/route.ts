import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { BetaAnalyticsDataClient } from '@google-analytics/data'

// Initialize the Analytics Data API client
function getAnalyticsClient() {
  const credentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON

  if (!credentials) {
    return null
  }

  try {
    const parsedCredentials = JSON.parse(credentials)
    return new BetaAnalyticsDataClient({
      credentials: parsedCredentials,
    })
  } catch {
    console.error('Failed to parse Google credentials')
    return null
  }
}

export async function GET() {
  // Check authentication
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')

  if (!session?.value) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const propertyId = process.env.GA_PROPERTY_ID

  if (!propertyId) {
    return NextResponse.json({
      error: 'Analytics not configured',
      message: 'GA_PROPERTY_ID environment variable is not set'
    }, { status: 503 })
  }

  const analyticsClient = getAnalyticsClient()

  if (!analyticsClient) {
    return NextResponse.json({
      error: 'Analytics not configured',
      message: 'Google credentials not configured'
    }, { status: 503 })
  }

  try {
    // Get data for the last 30 days
    const [todayResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: 'today', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
      ],
    })

    const [last7DaysResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'averageSessionDuration' },
        { name: 'bounceRate' },
      ],
    })

    const [last30DaysResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
      ],
    })

    // Get top pages
    const [topPagesResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'pagePath' }],
      metrics: [{ name: 'screenPageViews' }],
      orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
      limit: 10,
    })

    // Get traffic sources
    const [trafficSourcesResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'sessionSource' }],
      metrics: [{ name: 'sessions' }],
      orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      limit: 5,
    })

    // Get daily visitors for the last 7 days (for chart)
    const [dailyVisitorsResponse] = await analyticsClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [{ startDate: '7daysAgo', endDate: 'today' }],
      dimensions: [{ name: 'date' }],
      metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
      orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
    })

    // Parse responses
    const parseMetrics = (response: typeof todayResponse) => {
      const row = response?.rows?.[0]
      return {
        activeUsers: parseInt(row?.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row?.metricValues?.[1]?.value || '0'),
        pageViews: parseInt(row?.metricValues?.[2]?.value || '0'),
        avgSessionDuration: parseFloat(row?.metricValues?.[3]?.value || '0'),
        bounceRate: row?.metricValues?.[4] ? parseFloat(row.metricValues[4].value || '0') : undefined,
      }
    }

    const topPages = topPagesResponse?.rows?.map(row => ({
      path: row.dimensionValues?.[0]?.value || '',
      views: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || []

    const trafficSources = trafficSourcesResponse?.rows?.map(row => ({
      source: row.dimensionValues?.[0]?.value || 'Direct',
      sessions: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || []

    const dailyVisitors = dailyVisitorsResponse?.rows?.map(row => ({
      date: row.dimensionValues?.[0]?.value || '',
      users: parseInt(row.metricValues?.[0]?.value || '0'),
      sessions: parseInt(row.metricValues?.[1]?.value || '0'),
    })) || []

    return NextResponse.json({
      today: parseMetrics(todayResponse),
      last7Days: parseMetrics(last7DaysResponse),
      last30Days: {
        activeUsers: parseInt(last30DaysResponse?.rows?.[0]?.metricValues?.[0]?.value || '0'),
        sessions: parseInt(last30DaysResponse?.rows?.[0]?.metricValues?.[1]?.value || '0'),
        pageViews: parseInt(last30DaysResponse?.rows?.[0]?.metricValues?.[2]?.value || '0'),
      },
      topPages,
      trafficSources,
      dailyVisitors,
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json({
      error: 'Failed to fetch analytics',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
