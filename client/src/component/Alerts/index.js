import Swal from "sweetalert2/dist/sweetalert2.js";
import "sweetalert2/src/sweetalert2.scss";

//! types=> success, error, info, warning, question

const Status = ({ text, type, position = "top" }) =>
  Swal.fire({
    position: position,
    html: text,
    icon: type,
    showCloseButton: true,
    showConfirmButton: true,
    focusConfirm: false,
  });

const Confirm = ({
  text,
  yes = "Yes",
  no = "No",
  type = "question",
  position = "top",
}) =>
  Swal.fire({
    position: position,
    html: text,
    icon: type,
    showCancelButton: true,
    confirmButtonText: yes,
    cancelButtonText: no,
  }).then((result) => {
    //console.log(result);
    if (result.value) {
      return true;
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      return false;
    }
  });

const Redirect = ({ text, type = "info", position = "top" }) =>
  Swal.fire({
    position: position,
    html: text,
    icon: type,
    showCloseButton: true,
    showConfirmButton: false,
    focusConfirm: false,
  });
export { Status, Confirm, Redirect };
