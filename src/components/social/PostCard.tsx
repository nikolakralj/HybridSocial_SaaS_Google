import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Heart, MessageCircle, Repeat2, Share2 } from "lucide-react";
import { motion } from "motion/react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export interface PostData {
  id: string;
  author: {
    name: string;
    handle: string;
    avatar: string;
  };
  time: string;
  text: string;
  tags?: string[];
  media?: string;
  counts: {
    like: number;
    comment: number;
    repost: number;
  };
  liked?: boolean;
}

interface PostCardProps {
  post: PostData;
  onLike?: () => void;
  onComment?: () => void;
  onRepost?: () => void;
  onShare?: () => void;
}

export function PostCard({ post, onLike, onComment, onRepost, onShare }: PostCardProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="bg-card border border-border/60 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-4">
        <Avatar className="h-10 w-10">
          <AvatarImage src={post.author.avatar} alt={post.author.name} />
          <AvatarFallback>{getInitials(post.author.name)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-semibold text-foreground">{post.author.name}</span>
            <span className="text-sm text-muted-foreground">{post.author.handle}</span>
            <span className="text-sm text-muted-foreground">· {post.time}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mb-3">
        <p className="text-foreground whitespace-pre-wrap">{post.text}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {post.tags.map((tag, idx) => (
              <span key={idx} className="text-accent-brand hover:underline cursor-pointer">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Media */}
      {post.media && (
        <div className="mb-3 rounded-lg overflow-hidden">
          <ImageWithFallback
            src={post.media}
            alt="Post media"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-6">
        <button
          onClick={onLike}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent-brand transition-colors group"
        >
          <Heart className={`h-4 w-4 ${post.liked ? "fill-accent-brand text-accent-brand" : ""}`} />
          <span className="text-sm">{post.counts.like}</span>
        </button>
        <button
          onClick={onComment}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent-brand transition-colors"
        >
          <MessageCircle className="h-4 w-4" />
          <span className="text-sm">{post.counts.comment}</span>
        </button>
        <button
          onClick={onRepost}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent-brand transition-colors"
        >
          <Repeat2 className="h-4 w-4" />
          <span className="text-sm">{post.counts.repost}</span>
        </button>
        <button
          onClick={onShare}
          className="flex items-center gap-1.5 text-muted-foreground hover:text-accent-brand transition-colors ml-auto"
        >
          <Share2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  );
}
