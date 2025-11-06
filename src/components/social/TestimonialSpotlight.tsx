import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { UserPlus, TrendingUp } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

interface TestimonialData {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  quote: string;
  metric?: {
    label: string;
    value: string;
  };
  image?: string;
}

interface TestimonialSpotlightProps {
  testimonial: TestimonialData;
  onFollow?: () => void;
}

export function TestimonialSpotlight({ testimonial, onFollow }: TestimonialSpotlightProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <div className="grid md:grid-cols-5 gap-6">
        {/* Image section */}
        {testimonial.image && (
          <div className="md:col-span-2">
            <ImageWithFallback
              src={testimonial.image}
              alt={testimonial.name}
              className="w-full h-full object-cover min-h-[240px]"
            />
          </div>
        )}

        {/* Content section */}
        <div className={`${testimonial.image ? "md:col-span-3" : "md:col-span-5"} p-6 flex flex-col justify-center gap-4`}>
          {/* Badge */}
          <Badge variant="secondary" className="w-fit">
            <TrendingUp className="h-3 w-3 mr-1" />
            Creator of the week
          </Badge>

          {/* Quote */}
          <blockquote className="text-lg text-foreground leading-relaxed">
            "{testimonial.quote}"
          </blockquote>

          {/* Author info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
              <AvatarFallback>{getInitials(testimonial.name)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
              <p className="text-muted-foreground">
                {testimonial.role} · {testimonial.company}
              </p>
            </div>
            {onFollow && (
              <Button onClick={onFollow} variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Follow
              </Button>
            )}
          </div>

          {/* Metric */}
          {testimonial.metric && (
            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                {testimonial.metric.value}
              </Badge>
              <span className="text-sm text-muted-foreground">{testimonial.metric.label}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
