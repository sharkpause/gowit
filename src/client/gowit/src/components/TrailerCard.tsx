export default function TrailerCard({
  image_url,
  duration,
  date,
  title,
}: {
  image_url: string;
  duration: number;
  date: string;
  title: string;
}) {
  return (
    <div className="h-36  rounded-lg w-fot">
      <div>
        <img src={image_url} alt="Poster Image" />
      </div>
      <div className="bg-gray-900 flex items-center text-[#F5F2F2]"></div>
    </div>
  );
}
