import { notFound } from "next/navigation";
import GithubUserCard from "@/components/GithubUserCard";

async function getGithubUser(username: string) {
  const res = await fetch(`https://api.github.com/users/${username}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function EmbedPage({
  params,
}: {
  params: { username: string };
}) {
  const user = await getGithubUser(params.username);

  if (!user) {
    notFound();
  }

  return (
    <div className="p-4">
      <GithubUserCard user={user} />
    </div>
  );
}
