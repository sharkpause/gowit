export function capitalizeEachWord(str: string) {
  return str
    .split(" ")
    .map((el) => {
      return el[0].toUpperCase() + el.slice(1);
    })
    .join(" ");
}

export function toDateInputValue(s?: string | null) {
  if (!s) return "";
  if (s.includes("T")) return s.split("T")[0];
  return s;
}

export function commentDate(created_at: string) {
  const nowDate = new Date();
  const created_at_length = created_at.length - 1;
  console.log();

  const dateComment = new Date(
    created_at.slice(0, created_at_length) + "+07:00",
  );

  const diffMs = nowDate.getTime() - dateComment.getTime();

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (seconds < 60)
    return `${seconds} ${seconds > 1 ? "seconds" : "second"} ago`;
  if (minutes < 60)
    return `${minutes} ${minutes > 1 ? "minutes" : "minute"} ago`;
  if (hours < 24) return `${hours} ${hours > 1 ? "hours" : "hour"} ago`;
  return `${days} ${days > 1 ? "days" : "day"} ago`;
}
