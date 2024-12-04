import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const username = params.username

  try {
    const response = await fetch(`https://api.github.com/users/${username}`)
    if (!response.ok) throw new Error('User not found')
    const userData = await response.json()

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>GitHub Card for ${userData.login}</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body>
        <div class="p-4">
          <div class="flex items-center space-x-4">
            <img src="${userData.avatar_url}" alt="${userData.name || userData.login}'s avatar" class="w-16 h-16 rounded-full">
            <div>
              <h2 class="text-xl font-bold">${userData.name || userData.login}</h2>
              <p class="text-gray-600">@${userData.login}</p>
              ${userData.bio ? `<p class="mt-2">${userData.bio}</p>` : ''}
              <div class="mt-2 flex space-x-4 text-sm">
                <span>Repos: ${userData.public_repos}</span>
                <span>Followers: ${userData.followers}</span>
                <span>Following: ${userData.following}</span>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch user data' }, { status: 400 })
  }
}

