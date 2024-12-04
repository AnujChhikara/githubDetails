import Image from 'next/image'

interface GithubUser {
  avatar_url: string
  name: string
  login: string
  bio: string
  public_repos: number
  followers: number
  following: number
}

export default function GithubUserCard({ user }: { user: GithubUser }) {
  return (
    <div className="flex items-center space-x-4">
      <Image
        src={user.avatar_url}
        alt={`${user.name || user.login}'s avatar`}
        width={100}
        height={100}
        className="rounded-full"
      />
      <div>
        <h2 className="text-2xl font-bold">{user.name || user.login}</h2>
        <p className="text-gray-600">@{user.login}</p>
        {user.bio && <p className="mt-2">{user.bio}</p>}
        <div className="mt-2 flex space-x-4">
          <span>Repos: {user.public_repos}</span>
          <span>Followers: {user.followers}</span>
          <span>Following: {user.following}</span>
        </div>
      </div>
    </div>
  )
}

