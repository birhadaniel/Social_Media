type Props = {
  text: string;
  isSender: boolean;
  time: string;
};

export default function MessageBubble({ text, isSender, time }: Props) {
  return (
    <div
      className={`flex flex-col max-w-xs md:max-w-sm ${
        isSender ? "ml-auto items-end" : "mr-auto items-start"
      }`}
    >
      <div
        className={`p-3 rounded-2xl text-sm shadow ${
          isSender
            ? "bg-blue-500 text-white rounded-br-none"
            : "bg-gray-700 text-white rounded-bl-none"
        }`}
      >
        {text}
      </div>
      <span className="text-gray-400 text-xs mt-1">{time}</span>
    </div>
  );
}
