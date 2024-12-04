import { NextRequest, NextResponse } from 'next/server'

const GITHUB_API_URL = 'https://api.github.com'

async function fetchWithAuth(url: string) {
  const response = await fetch(url, {
    headers: {
      'Authorization': `token ${process.env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  })
  if (!response.ok) throw new Error(`GitHub API error: ${response.statusText}`)
  return response.json()
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const username = searchParams.get('username')
  const org = searchParams.get('org')

  if (!username || !org) {
    return NextResponse.json({ error: 'Username and organization name are required' }, { status: 400 })
  }

  try {
    const [pullRequests, issues] = await Promise.all([
      fetchWithAuth(`${GITHUB_API_URL}/search/issues?q=author:${username}+org:${org}+type:pr&sort=created&order=desc&per_page=50`),
      fetchWithAuth(`${GITHUB_API_URL}/search/issues?q=author:${username}+org:${org}+type:issue&sort=created&order=desc&per_page=50`)
    ])

    const contributions = [
      ...pullRequests.items.map((pr: any) => ({
        type: 'Pull Request',
        repo: pr.repository_url.split('/').slice(-1)[0],
        title: pr.title,
        url: pr.html_url,
        createdAt: pr.created_at
      })),
      ...issues.items.map((issue: any) => ({
        type: 'Issue',
        repo: issue.repository_url.split('/').slice(-1)[0],
        title: issue.title,
        url: issue.html_url,
        createdAt: issue.created_at
      }))
    ]

    // Sort contributions by date (most recent first)
    contributions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    // Limit to the 10 most recent contributions
    const recentContributions = contributions.slice(0, 10)

    return NextResponse.json(recentContributions)
  } catch (error) {
    console.error('Error fetching contributions:', error)
    return NextResponse.json({ error: 'Failed to fetch contributions' }, { status: 500 })
  }
}

