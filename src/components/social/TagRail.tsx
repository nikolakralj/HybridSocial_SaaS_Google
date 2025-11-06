import { useState } from "react";

const defaultTags = ["hiring", "freelance", "launch", "design", "react", "devops", "remote"];

interface TagRailProps {
  tags?: string[];
  onTagClick?: (tag: string) => void;
}

export function TagRail({ tags = defaultTags, onTagClick }: TagRailProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleTagClick = (tag: string) => {
    const newTag = selectedTag === tag ? null : tag;
    setSelectedTag(newTag);
    onTagClick?.(tag);
  };

  return (
    <div className="w-full overflow-x-auto scrollbar-hide">
      <div className="flex gap-3 py-4 px-1 min-w-max">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedTag === tag
                ? "bg-foreground text-background"
                : "bg-transparent text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            #{tag}
          </button>
        ))}
      </div>
    </div>
  );
}
