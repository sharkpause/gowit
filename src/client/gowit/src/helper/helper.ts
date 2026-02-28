export function capitalizeEachWord(str: string) {
  return str
    .split(" ")
    .map((el) => {
      return el[0].toUpperCase() + el.slice(1);
    })
    .join(" ");
}
