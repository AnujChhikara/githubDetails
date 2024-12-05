"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Overview } from "./overview";
import { UserNav } from "./user-nav";
import { GitHubIssueCard } from "./GithubCard";

interface Contribution {
  total_count: number;
  incomplete_results: boolean;
  items: unknown[];
}

export default function OrgContributionsSection() {
  const [username, setUsername] = useState("");
  const [orgName, setOrgName] = useState("");
  const [contributions, setContributions] = useState<Contribution>();
  const [issueContributions, setIssueContributions] = useState<Contribution>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchContributions = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setContributions(undefined);

    try {
      const response = await fetch(
        `https://api.github.com/search/issues?q=author:${username}+org:${orgName}+type:pr`
      );
      const issueResponse = await fetch(
        `https://api.github.com/search/issues?q=author:${username}+org:${orgName}+type:issue`
      );
      if (!response.ok || !issueResponse.ok)
        throw new Error("Failed to fetch contributions");
      const data2 = await issueResponse.json();
      setIssueContributions(data2);
      if (!response.ok) throw new Error("Failed to fetch contributions");
      const data = await response.json();
      setContributions(data);
    } catch (err) {
      console.log(err);
      setError(
        "Failed to fetch contributions. Please check the username and organization name and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Contributions</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={fetchContributions} className='space-y-4'>
          <div className='flex gap-2'>
            <Input
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder='Enter GitHub username'
              required
            />
            <Input
              type='text'
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              placeholder='Enter organization name'
              required
            />
          </div>
          <Button type='submit' disabled={loading} className='w-full'>
            {loading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Fetching Contributions...
              </>
            ) : (
              "Fetch Contributions"
            )}
          </Button>
        </form>
        {contributions &&
          contributions.total_count > 0 &&
          issueContributions &&
          issueContributions?.total_count > 0 && (
            <DashboardPage
              data={contributions.items}
              data2={issueContributions.items}
            />
          )}

        {error && <p className='text-red-500 mt-4'>{error}</p>}

        {contributions && <div> </div>}
      </CardContent>
    </Card>
  );
}
interface DashboardPageProps {
  data: Array<{
    id: number;
    title: string;
    state: string;
    html_url: string;
    user: {
      login: string;
      avatar_url: string;
      html_url: string;
    };
    assignee?: {
      login: string;
      avatar_url: string;
    };
    created_at: string;
    updated_at: string;
    closed_at?: string;
  }>;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ data, data2 }) => {
  return (
    <>
      <div className='hidden flex-col md:flex'>
        <div className='border-b'>
          <div className='flex h-16 items-center px-4'>
            <div className='ml-auto flex items-center space-x-4'>
              <UserNav imageUrl={data[0]?.user.avatar_url} />
              <span>{data[0]?.user.login}</span>
            </div>
          </div>
        </div>
        <div className='flex-1 space-y-4 p-8 pt-6'>
          <div className='flex items-center justify-between space-y-2'>
            <h2 className='text-3xl font-bold tracking-tight'>Dashboard</h2>
          </div>
          <Tabs defaultValue='overview' className='space-y-4'>
            <TabsContent value='overview' className='space-y-4'>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
                <Card>
                  <CardHeader
                    className='flex flex-row items-center
                   justify-between space-y-0 pb-2'
                  >
                    <CardTitle className='text-sm font-medium'>
                      Total Contributions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{data.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Issues
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>{data2.length}</div>
                  </CardContent>
                </Card>
              </div>
              <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
                <Card className='col-span-4'>
                  {data2.map((item, index) => (
                    <div key={index}>
                      <GitHubIssueCard issue={item} />
                    </div>
                  ))}
                </Card>
                <Card className='col-span-3'>
                  {data.map((item, index) => (
                    <div key={index}>
                      <GitHubIssueCard issue={item} />
                    </div>
                  ))}
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};
