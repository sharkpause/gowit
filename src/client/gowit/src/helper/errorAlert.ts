import Swal from "sweetalert2";

export function errorAlert(title: string) {
  return Swal.fire({
    icon: "error",
    title: title,
    buttonsStyling: false,
    background: "#0F1115",
    color: "#F5F2F2",
    customClass: {
      title: "text-white",
      confirmButton:
        "px-4 py-2 rounded-lg bg-[#E8630A] text-white hover:bg-[#C75409] focus:outline-none",
    },
  });
}
