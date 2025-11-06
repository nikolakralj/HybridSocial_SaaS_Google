import { useState, useEffect } from "react";
import { PostCard, PostData } from "./PostCard";
import { AnimatePresence } from "motion/react";

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
    text: "Landed my first 12-week contract through WorkGraph! Onboarding was smooth and I got paid faster than any platform I've used. Highly recommend.",
    tags: ["#freelance", "#success"],
    counts: { like: 203, comment: 45, repost: 18 },
    liked: true,
  },
];

interface MiniFeedProps {
  posts?: PostData[];
  autoRotate?: boolean;
  rotateInterval?: number;
  onAction?: () => void;
}

export function MiniFeed({
  posts = samplePosts,
  autoRotate = true,
  rotateInterval = 4000,
  onAction,
}: MiniFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!autoRotate || isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % posts.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, isPaused, posts.length, rotateInterval]);

  const currentPost = posts[currentIndex];

  return (
    <div
      className="w-full"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <PostCard
          key={currentPost.id}
          post={currentPost}
          onLike={onAction}
          onComment={onAction}
          onRepost={onAction}
          onShare={onAction}
        />
      </AnimatePresence>

      {/* Progress indicators */}
      <div className="flex gap-1.5 mt-3 justify-center">
        {posts.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentIndex ? "w-6 bg-accent-brand" : "w-1.5 bg-border"
            }`}
            aria-label={`Go to post ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
