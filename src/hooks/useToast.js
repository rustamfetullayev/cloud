import Swal from "sweetalert2";

export const useToast = (props) =>
  Swal.mixin({
    toast: true,
    position: "top",
    showConfirmButton: false,
    timer: 2000,
    ...props,
  });
