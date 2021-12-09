$(document).ready(function () {
  new CheckBox();
});

class CheckBox {
  HeaderCheck = false;
  constructor() {
    this.initEvent();
  }
  initEvent() {
    $(".t-table thead .t-table-check").click(this.handleCheckAll.bind(this));
    $(".t-table tbody").on("click", ".t-table-check", this.handleCheck);
  }
  handleCheckAll() {
    //nấy tất cả các phần tửa của tr có class table check
    let trsCheckbox = $(".t-table tr .t-table-check");
    //nếu this.header check là true thì add class check
    for (const trCheckbox of trsCheckbox) {
      if (this.HeaderCheck) {
        $(trCheckbox).removeClass("t-table-checked");
        //tìm kiếm tất cả các phần tử tr nếu check thì bỏ check
      } else {
        $(trCheckbox).addClass("t-table-checked");
        //Tìm kiếm tất cả các phần tử tr nếu chưa check thì check hết
      }
    }
    // tìm kiếm tất cả các phần tử tr check
    this.HeaderCheck = !this.HeaderCheck;
  }
  handleCheck() {
    if ($(this).hasClass("t-table-checked")) {
      $(this).removeClass("t-table-checked");
    } else {
      $(this).addClass("t-table-checked");
    }
  }
}
