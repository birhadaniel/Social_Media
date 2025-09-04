import { useState } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface CommentFormProps {
  postId: number;
}

export default function CommentForm({ postId }: CommentFormProps) {
  const { handleComment, loading, error } = usePosts();
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    await handleComment(postId, content);
    setContent('');
  };

  return (
    <div className="flex gap-2">
      {error && <p className="text-red-500">{error}</p>}
      <Input
        type="text"
        placeholder="Add a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={loading || !content}>
        {loading ? 'Commenting...' : 'Comment'}
      </Button>
    </div>
  );
}