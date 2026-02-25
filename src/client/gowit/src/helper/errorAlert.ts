import Swal from "sweetalert2";

export function errorAlert(title: string, description: string = "") {
  return Swal.fire({
    icon: "error",
    title: title,
    text: description,
  });
}
