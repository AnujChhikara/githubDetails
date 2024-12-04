import GithubCardGenerator from "../components/GithubCardGenerator";
import OrgContributionsSection from "../components/OrgContributionsSection";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        GitHub User Card & Contributions Generator
      </h1>
      <div className="space-y-12">
        <GithubCardGenerator />
        <OrgContributionsSection />
      </div>
    </main>
  );
}
