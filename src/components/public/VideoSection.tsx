import { motion } from "framer-motion";
import { Play } from "lucide-react";
import YouTube from "react-youtube";

const fadeUp: any = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function VideoSection({ youtubeUrl }: { youtubeUrl: string | null }) {
  if (!youtubeUrl) return null;

  // Extract video ID from youtube URL
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(youtubeUrl);
  if (!videoId) return null;

  const opts = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 0,
    },
  };

  return (
    <motion.section variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
          <Play className="w-5 h-5 text-accent" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-display text-foreground">Featured Video</h2>
      </div>

      <div className="bg-card shadow-card rounded-xl border border-border overflow-hidden relative" style={{ paddingBottom: '56.25%', height: 0 }}>
        <div className="absolute top-0 left-0 w-full h-full">
          <YouTube videoId={videoId} opts={opts} className="w-full h-full" iframeClassName="w-full h-full rounded-xl" />
        </div>
      </div>
    </motion.section>
  );
}
