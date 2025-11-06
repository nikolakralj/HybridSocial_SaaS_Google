import { PostCard, PostData } from "./PostCard";
import { ProfileCard, ProfileData } from "./ProfileCard";
import { Button } from "../ui/button";

const samplePosts: PostData[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      handle: "@sarah",
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=100&h=100&fit=crop",
    },
    time: "2h",
    text: "Just wrapped a major refactor that cut load time by 60%. Sometimes the best code is the code you delete. 🚀",
    tags: ["#performance", "#react"],
    media: "https://images.unsplash.com/photo-1660810731526-0720827cbd38?w=600&h=300&fit=crop",
    counts: { like: 127, comment: 23, repost: 8 },
    liked: false,
  },
  {
    id: "2",
    author: {
      name: "Marcus Kim",
      handle: "@marcusk",
      avatar: "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?w=100&h=100&fit=crop",
    },
    time: "4h",
    text: "Looking for React devs who know their way around Next.js 15. Drop your portfolio below! 👇",
    tags: ["#hiring", "#react", "#nextjs"],
    counts: { like: 89, comment: 34, repost: 12 },
    liked: false,
  },
  {
    id: "3",
    author: {
      name: "Emma Rodriguez",
      handle: "@emmarodriguez",
      avatar: "https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=100&h=100&fit=crop",
    },
    time: "6h",
    text: "Landed my first 12-week contract through WorkGraph! Onboarding was smooth and I got paid faster than any platform I've used.",
    tags: ["#freelance", "#success"],
    counts: { like: 203, comment: 45, repost: 18 },
    liked: true,
  },
];

const featuredProfiles: ProfileData[] = [
  {
    id: "1",
    name: "Emma Rodriguez",
    role: "DevOps Engineer",
    avatar: "https://images.unsplash.com/photo-1618593706014-06782cd3bb3b?w=100&h=100&fit=crop",
    followers: "12.6k",
    skills: ["AWS", "Kubernetes", "Terraform"],
    mutuals: "Followed by Alex + 3",
  },
  {
    id: "2",
    name: "Marcus Kim",
    role: "Full-Stack Developer",
    avatar: "https://images.unsplash.com/photo-1737575655055-e3967cbefd03?w=100&h=100&fit=crop",
    followers: "8.2k",
    skills: ["React", "Node.js", "TypeScript"],
    mutuals: "Followed by Sarah + 5",
  },
];

interface SeeWhatsHappeningProps {
  onAction?: () => void;
}

export function SeeWhatsHappening({ onAction }: SeeWhatsHappeningProps) {
  return (
    <section className="py-24 md:py-32 px-6 bg-accent/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl mb-4 font-semibold tracking-tight">
            See what's happening
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect with professionals, discover opportunities, stay updated.
          </p>
        </div>

        {/* Content grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left: Posts (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {samplePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onLike={onAction}
                onComment={onAction}
                onRepost={onAction}
                onShare={onAction}
              />
            ))}
          </div>

          {/* Right: Featured profiles + CTA (1 col) */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground px-1">Featured profiles</h3>
              {featuredProfiles.map((profile) => (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  onFollow={onAction}
                />
              ))}
            </div>
            
            {/* CTA card */}
            <div className="bg-card border border-border rounded-2xl p-8 text-center space-y-6 mt-8">
              <div className="space-y-3">
                <h4 className="text-xl font-semibold text-foreground">Join the community</h4>
                <p className="text-sm text-muted-foreground m-0">
                  28k professionals building the future of work.
                </p>
              </div>
              <Button onClick={onAction} size="lg" className="w-full rounded-xl">
                Get started free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
