import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/Button';

interface LikeButtonProps {
  postId: number;
}

export default function LikeButton({ postId }: LikeButtonProps) {
  const { handleLikePost, loading } = usePosts();

  return (
    <Button onClick={() => handleLikePost(postId)} disabled={loading}>
      {loading ? 'Liking...' : 'Like'}
    </Button>
  );
}