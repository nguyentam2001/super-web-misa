class Validate {
  constructor() {}
  /**
   * validate dữ liệu cất lên sever
   * Author: NVTAM (11/29/2021)
   */
  initEvent() {
    //Khi focus vào thì xóa hết thông báo lỗi của input hiện tại
    $("#FullName").focus(this.validateOnFocus);
  }

  /**
   * Ẩn message lỗi khi focus
   * Author NVTâm (11/29/2021)
   */
  validateOnFocus() {
    //Ẩn error message
    let currError = $(this).siblings(".error-message");
    $(currError).hide();
  }
  static validateData(eleValidates) {
    // Tạo mảng check tất cả các trường
    let arrTrue = [];
    for (const validate of eleValidates) {
      //biến kiểm tra từng trường
      let isTrue = true;
      //Duyệt qua từng trường có attr là Validate
      let validateName = $(validate).attr("validate");
      let value = $(validate).val();
      switch (validateName) {
        case "FullName":
          // lấy element error của input hiện tại
          let erorMs = $(validate).siblings(".error-message");
          if (value.length == 0) {
            isTrue = false;
            //thông báo lỗi
            $(erorMs).show();
            //border chuyển sang màu đỏ
            $(validate).addClass("border-error");
          } else {
            $(erorMs).hide();
            isTrue = true;
            $(validate).removeClass("border-error");
          }
          break;
        case "Department":
          if (value.length == 0) {
            isTrue = false;
            //border chuyển sang màu đỏ
            $(validate).addClass("border-error");
          } else {
            isTrue = true;
            $(validate).removeClass("border-error");
          }
          break;
        default:
          break;
      }
      arrTrue.push(isTrue);
    }
    //Trả về kết quả có hợp lệ hay không
    return arrTrue.every((isTrue) => isTrue);
  }
}
