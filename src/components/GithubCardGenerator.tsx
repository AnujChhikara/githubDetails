"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import GithubUserCard from "./GithubUserCard";
import html2canvas from "html2canvas";

export default function GithubCardGenerator() {
  const [username, setUsername] = useState("");
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const fetchUserData = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setUserData(null);

    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      if (!response.ok) throw new Error("User not found");
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.log(err);
      setError(
        "Failed to fetch user data. Please check the username and try again."
      );
    }
  };

  const downloadCard = () => {
    const card = document.getElementById("github-card");
    if (card) {
      html2canvas(card).then((canvas) => {
        const link = document.createElement("a");
        link.download = `${username}-github-card.png`;
        link.href = canvas.toDataURL();
        link.click();
      });
    }
  };

  const getEmbedCode = () => {
    return `<iframe src="${window.location.origin}/embed/${username}" width="100%" height="200" frameborder="0"></iframe>`;
  };

  return (
    <div className="space-y-6">
      <form onSubmit={fetchUserData} className="flex gap-2">
        <Input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          required
        />
        <Button type="submit">Generate Card</Button>
      </form>

      {error && <p className="text-red-500">{error}</p>}

      {userData && (
        <div className="space-y-4">
          <Card className="p-6" id="github-card">
            <GithubUserCard user={userData} />
          </Card>

          <div className="space-y-2">
            <Button onClick={downloadCard} className="w-full">
              Download as Image
            </Button>
            <Card className="p-4">
              <h3 className="font-semibold mb-2">Embed Code:</h3>
              <code className="bg-gray-100 p-2 rounded block">
                {getEmbedCode()}
              </code>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
