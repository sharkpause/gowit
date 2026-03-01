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
