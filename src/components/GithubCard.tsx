import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GitPullRequest, MessageSquare } from "lucide-react";

interface GitHubIssue {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  };
  labels: any[];
  state: string;
  locked: boolean;
  assignee: {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  } | null;
  assignees: {
    login: string;
    id: number;
    avatar_url: string;
    gravatar_id: string;
    url: string;
    html_url: string;
    followers_url: string;
    following_url: string;
    gists_url: string;
    starred_url: string;
    subscriptions_url: string;
    organizations_url: string;
    repos_url: string;
    events_url: string;
    received_events_url: string;
    type: string;
    site_admin: boolean;
  }[];
  milestone: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at: string | null;
  author_association: string;
  active_lock_reason: string | null;
  draft?: boolean;
  pull_request?: {
    url: string;
    html_url: string;
    diff_url: string;
    patch_url: string;
    merged_at: string | null;
  };
  body: string;
  reactions: {
    url: string;
    total_count: number;
    "+1": number;
    "-1": number;
    laugh: number;
    hooray: number;
    confused: number;
    heart: number;
    rocket: number;
    eyes: number;
  };
  timeline_url: string;
  performed_via_github_app: any;
  state_reason: string | null;
}

interface GitHubIssueCardProps {
  issue: GitHubIssue;
}

export function GitHubIssueCard({ issue }: GitHubIssueCardProps) {
  const isPullRequest = !!issue.pull_request;
  const isMerged = isPullRequest && issue.pull_request.merged_at;
  const stateColor =
    issue.state === "open"
      ? "bg-green-500"
      : isMerged
      ? "bg-purple-500"
      : "bg-red-500";

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className='w-full max-w-md'>
      <CardHeader className='flex flex-row items-center gap-4'>
        <Avatar className='h-10 w-10'>
          <AvatarImage src={issue.user.avatar_url} alt={issue.user.login} />
          <AvatarFallback>
            {issue.user.login.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className='flex flex-col'>
          <CardTitle className='text-base font-medium'>
            {issue.user.login}
          </CardTitle>
          <p className='text-sm text-muted-foreground'>
            Created on {formatDate(issue.created_at)}
          </p>
        </div>
      </CardHeader>
      <CardContent className='grid gap-4'>
        <div className='flex items-center gap-2'>
          {isPullRequest ? <GitPullRequest className='h-4 w-4' /> : "#"}
          <span className='font-medium'>#{issue.number}</span>
          <Badge
            variant='outline'
            className={`ml-auto ${stateColor} text-white`}
          >
            {isMerged ? "Merged" : issue.state}
          </Badge>
        </div>
        <h3 className='text-lg font-semibold'>{issue.title}</h3>
        {issue.closed_at && (
          <p className='text-sm text-muted-foreground'>
            Closed on {formatDate(issue.closed_at)}
          </p>
        )}
      </CardContent>
      <CardFooter>
        <div className='flex items-center text-sm text-muted-foreground'>
          <MessageSquare className='mr-1 h-4 w-4' />
          {issue.comments} comment{issue.comments !== 1 ? "s" : ""}
        </div>
      </CardFooter>
    </Card>
  );
}
