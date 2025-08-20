import Image from "next/image";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";

type Props = {
  name: string;
  username: string;
  time: string;
  content: string;
  image?: string;
  ProfileImage?: string;
  likes?: number;
  comments?: number;
  shares?: number;
};

export default function PostCard({
  name,
  username,
  time,
  content,
  image,
  ProfileImage,
  likes = 0,
  comments = 0,
  shares = 0,
}: Props) {
  return (
    <article className="bg-white dark:bg-gray-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-800 p-4">

      <header className="flex items-center gap-3">
        {ProfileImage && (
          <Image
            src={ProfileImage}
            alt={`${name}'s profile picture`}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full mr-2 object-cover"
          />
        )}
        <div>
          <div className="flex  items-center gap-2">
            <span className="font-semibold text-gray-900 dark:text-white">
              {name}
            </span>
            <span className="text-gray-500">@{username}</span>
            <span className="text-gray-400">· {time}</span>
          </div>
        </div>
      </header>

      <p className="mt-3 text-gray-800 dark:text-gray-200">{content}</p>

      {/* Post Image */}
      {image && (
        <div className="mt-3 relative w-full overflow-hidden rounded-lg">
          <Image
            src={image}
            alt="Post image"
            width={800} 
            height={600} 
            className="w-full h-auto object-cover rounded-lg"
          />
        </div>
      )}

      <footer className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <button className="flex items-center gap-2 hover:text-sky-600 focus:outline-none">
          <Heart className="w-5 h-5" /> {likes}
        </button>
        <button className="flex items-center gap-2 hover:text-sky-600 focus:outline-none">
          <MessageCircle className="w-5 h-5" /> {comments}
        </button>
        <button className="flex items-center gap-2 hover:text-sky-600 focus:outline-none">
          <Repeat2 className="w-5 h-5" /> {shares}
        </button>
      </footer>
    </article>
  );
}
