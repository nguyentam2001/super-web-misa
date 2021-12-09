$(document).ready(function () {
  new Employee();
});

class Employee {
  Url = "http://amis.manhnv.net/api/v1/Employees";
  EmployeeId = null;
  FormMode = null;
  employeeCode = null;
  //pageSize kích thước bản ghi/ trang
  PageSize = null;
  TotalPage = null;
  //Mặc định page sau loading =1
  CurrPageIndex = 1;
  //Số lượng button phân trang lớn nhất là 4
  MaxPageIndexButton = 3;
  constructor() {
    //load data
    this.loadData();
    this.initEvent();
    this.addEventClickToWindow();
  }
  initEvent() {
    //reload page
    $("#reLoadBtn").click(this.reLoadData.bind(this));
    //Thêm mới nhân viên
    $("#btnAddEmployee").click(this.addEmployeeOnClick.bind(this));
    //Thoát form
    $("#btnEscape").click(this.escapeFormOnClick.bind(this));
    //Hủy form
    $("#btnCancel").click(this.escapeFormOnClick.bind(this));
    //Hủy xóa
    $("#btnCancelPopUpDel").click(this.escapePopUpOnClick.bind(this));
    //Cất dữ liệu
    $("#saveEmployee").click(this.saveEmployeeOnClick.bind(this));
    //Cất và thêm dữ liệu
    $("#saveAddEmployee").click(this.saveAddEmployeeOnClick.bind(this));
    //Sửa dữ liệu
    $("table#tableEmployees ").on(
      "click",
      ".t-row-update",
      this.update.bind(this)
    );
    //Hiển thị pop up  xóa
    $("#showPopUpDel ").click(this.ShowPopUpDel.bind(this));

    //Hiển thị list menu để chọn xóa
    $("table#tableEmployees ").on(
      "click",
      ".t-row-more-down",
      this.showListMenuDel.bind(this)
    );

    //Xóa nhân viên
    $("#btnDelEmployee").click(this.delete.bind(this));
    //Ẩn pop up thông báo lỗi
    $("#showDialogError .t-btn").click(this.hidePopupError);
    //Thêm background khi click vào mỗi hàng
    $("table#tableEmployees ").on("click", "tbody tr", this.focusTrOnClick);
    //Xử lý số lượng nhân viên hiển thị trên 1 trang
    $("#cbxPageSize .t-combobox-item").click(
      this.numbersEmployeesOnPage.bind(this)
    );
    //Tìm kiếm nhân viên
    $("#searchEmployeeBtn").click(this.handleSearchEmployee.bind(this));
    //Tìm kiếm nhân viên khi nhấn enter
    $("#searchEmployee").keyup(this.searchEmployeeOnKeyup.bind(this));
    //Sự kiện click vào các button phân trang
    $(".t-table-paging-numbers .t-table-paging-numbers-wrapper").on(
      "click",
      ".t-table-paging-number",
      this.handlePagingNumberOnClick.bind(this)
    );
    //sự kiện chuyển về trang trước
    $(".t-table-paging-numbers .t-table-paging-before").click(
      this.handlePrevPaging.bind(this)
    );
    //sự kiện chuyển sang trang sau
    $(".t-table-paging-numbers .t-table-paging-after").click(
      this.handleNextPaging.bind(this)
    );
  }

  /**
   * sự kiên nhấn nút trước
   * Author: NVTAM (2/12/2021)
   */
  handlePrevPaging(sender) {
    //Lấy button element paging hiện tại
    let numbersParent = $(sender.target).siblings(
      ".t-table-paging-numbers-wrapper"
    );
    let numberPageActive = $(numbersParent).find(
      ".t-table-paging-number.t-table-paging-active"
    );
    //Kiểm tra nếu current trang hiện tại >1 thì chuyển trang
    if (this.CurrPageIndex > 1) {
      this.CurrPageIndex--;
      //Xóa class active của btn hiện tại
      $(numberPageActive).removeClass("t-table-paging-active");
      let numberPrevPaging = $(numberPageActive).prev();
      //Chuyển active về btn paging trước đó
      $(numberPrevPaging).addClass("t-table-paging-active");
      this.loadData();
    } else {
      $(sender.target).addClass("stop");
    }
  }
  /**
   * sự kiên nhấn nút sau
   * Author: NVTAM (2/12/2021)
   */
  handleNextPaging(sender) {
    //Lấy button element paging hiện tại
    let numbersParent = $(sender.target).siblings(
      ".t-table-paging-numbers-wrapper"
    );
    let numberPageActive = $(numbersParent).find(
      ".t-table-paging-number.t-table-paging-active"
    );

    //Kiểm tra nếu current page < totalPage thì chuyển trang
    if (this.CurrPageIndex < this.TotalPage) {
      console.log(`totalPage`, this.TotalPage);
      this.CurrPageIndex++;
      console.log(" this.CurrPageIndex", this.CurrPageIndex);
      //Xóa class active của btn hiện tại
      $(numberPageActive).removeClass("t-table-paging-active");
      let numberNextPaging = $(numberPageActive).next();
      //Chuyển active về btn paging trước đó
      $(numberNextPaging).addClass("t-table-paging-active");
      this.loadData();
    }
  }
  /**
   * Chọn trang
   * Author :NVT (1/12/2021)
   */
  handlePagingNumberOnClick(sender) {
    const currBtn = $(sender.target);
    //lấy data value index của button hiện tại
    let currPageIndex = currBtn.data("value");
    this.CurrPageIndex = currPageIndex;
    console.log(`CurrPageIndex`, this.CurrPageIndex);
    //xóa các class button tử đang active hiện tại
    let button = currBtn.siblings(".t-table-paging-active");
    button.removeClass("t-table-paging-active");
    currBtn.addClass("t-table-paging-active");
    //load lại trang
    this.loadData();
  }
  /**
   * Hiển thị số nhân viên trên trang
   * Author :NVT (1/12/2021)
   */
  numbersEmployeesOnPage(sender) {
    let pageSize = $(sender.target).attr("value");
    this.PageSize = pageSize;
    //Xóa class có item selected được chọn trước đó
    let items = $(sender.target).siblings(".t-combobox-item");
    for (const item of items) {
      if ($(item).hasClass("selected")) {
        $(item).removeClass("selected");
      }
    }
    //Thêm background focus cho item được chọn
    $(sender.target).addClass("selected");
    //set lại current page index là 1
    this.CurrPageIndex = 1;
    //load lại dữ liệu mỗi lần chọn kích thước trang
    this.loadData();
  }

  /**
   * Tìm kiếm nhân viên btn search
   * Author: Nguyễn Văn Tâm(1/12/2021)
   */

  handleSearchEmployee() {
    //Gọi API thực hiện lấy các dữ liệu
    this.loadData();
  }

  /**
   * Tìm kiếm nhân viên khi nhấn enter
   * Author: Nguyễn Văn Tâm(1/12/2021)
   */
  searchEmployeeOnKeyup(sender) {
    if (sender.keyCode == 13) {
      this.loadData();
    }
  }
  /**
   * Thêm bg color vào mỗi hàng
   * Author :NVT (30/11/2021)
   */

  focusTrOnClick() {
    let trsFocus = $(this).siblings("table#tableEmployees tr.focus");
    for (const tr of trsFocus) {
      $(tr).removeClass("focus");
    }
    $(this).addClass("focus");
  }

  /**
   * Ẩ thông báo lỗi
   * Author :NVT (30/11/2021)
   */

  hidePopupError() {
    $("#showDialogError").hide();
  }

  /**
   * hủy form xóa
   * Author: Nguyễn Văn Tâm (29/11/2021)
   */
  escapePopUpOnClick() {
    $("#showDialogDel").hide();
  }
  /**
   * hiển thị pop up  xóa
   * Author Nguyễn Văn Tâm (29/11/2021)
   */
  ShowPopUpDel() {
    $("#showDialogDel").show();
    //ẩn menu list xóa
    $("#listOption").hide();
  }

  /**
   * hiển thị list menu chọn xóa
   * Author Nguyễn Văn Tâm (29/11/2021)
   */

  showListMenuDel(sender) {
    //Xóa các btn có class more
    let trCurr = $(sender.target).closest("tr");
    let trs = $(trCurr).siblings("tr");
    for (const tr of trs) {
      let btnMore = $(tr).find(".t-row-more-down");
      $(btnMore).removeClass("active");
    }
    //add class border cho btn more
    $(sender.target).addClass("active");
    //Thuộc tính clientX và Y để set vị trí cho del menu list
    let toLeft = sender.clientX - 110;
    let toTop = sender.clientY + 6;
    //set vị trí cho menu del
    $("#listOption").css({ top: toTop, left: toLeft });
    //Hiển thi list menu xóa
    $("#listOption").show();
    //Lấy id nhân viên cần xóa
    this.EmployeeId = $(trCurr).data("EmployeeId");

    //lấy employee code nhân viên vào text của popup delete
    let employeeCode = $(trCurr).data("Employee").EmployeeCode;
    $("#showDialogDel .text-employee-code").text(employeeCode);
  }
  /**
   * reload lại data
   * Author:NVTAM(1/12/2021)
   */
  reLoadData() {
    this.loadData();
  }
  /**
   * Load page
   * Author: NVTAM (1/12/2021)
   */
  loadData() {
    $("#dialogLoader").show();
    let me = this;
    //số lượng nhân viên trên trang
    const pageSize = this.PageSize || $("#cbxPageSize").attr("value");
    //tạo rỗng dữ liệu
    $("table#tableEmployees tbody").empty();
    //lấy từng th header
    const ths = $("table#tableEmployees thead th");
    //cột check box
    let thCheck = `
    <div class="t-table-checks-wrapper">
            <div class="t-table-check">
            </div>
      </div>
  `;
    //cột chức năng ở body
    let tdFunc = `
   <div class="t-row-func">
     <div class="t-row-update">Sửa</div>
       <div class="t-row-more">
        <div class="t-row-more-down"></div>
           
       </div>
       </div>
   `;
    //Thao tác phân trang
    //Gọi API thực hiện lấy dữ liệu
    //kiểm tra nếu có giá trị input search thì chuyển url filter
    const searchText = $("#searchEmployee").val();
    let urlApi;
    urlApi = `http://amis.manhnv.net/api/v1/Employees/filter?pageSize=${pageSize}&pageNumber=${this.CurrPageIndex}&employeeFilter=${searchText}`;
    //gọi dữ liệu qua ajax
    $.ajax({
      type: "GET",
      url: urlApi,
      async: true,
      //Nếu async cho là false thì nó sẽ chờ cái ajax này chạy xong thì nó mới gọi đến hàm khác
      //Nhưng có nhược điểm là nó khóa html và không cho mình gán biểu tượng xoay xoay khi gán html
      success: function (data) {
        $("#dialogLoader").hide();
        let arrayData = data.Data;
        let totalRecords = data.TotalRecord;
        //hiển thị tổng số bản ghi
        $(".t-table-paging-left .t-table-paging-sum").text(totalRecords);
        //hiển thị số bản ghi trả trên trang
        let dataLength = 0;
        //Số lượng nhân viên trả về < pageSize
        if (arrayData.length < +pageSize) {
          dataLength = arrayData.length;
        } else {
          //Số lượng nhân viên trả về > pageSize
          dataLength = +pageSize;
        }

        //lấy các thông tin thực hiện phân trang
        //Thực hiện tính toán số liệu hiển thị lên giao diện: (tổng số bản ghi, thông tin, index bản ghi)
        //Tổng số trang
        let totalPage = data.TotalPage;
        me.TotalPage = totalPage;

        //Thêm trạng thái cho button "Trước" và "Sau"
        if (me.CurrPageIndex == totalPage) {
          //Làm mờ nút chuyển trang "Sau"
          $(".t-table-paging-numbers .t-table-paging-after").addClass("stop");
        } else {
          //Hiện nút chuyển trang "Sau"
          $(".t-table-paging-numbers .t-table-paging-after").removeClass(
            "stop"
          );
        }
        if (me.CurrPageIndex <= 1) {
          //làm mờ nút chuyển trang "Trước"
          $(".t-table-paging-numbers .t-table-paging-before").addClass("stop");
        } else {
          //Hiện nút chuyển trang "Trước"
          $(".t-table-paging-numbers .t-table-paging-before").removeClass(
            "stop"
          );
        }
        //Làm trống các html table paging ban đầu
        $(".t-table-paging-numbers .t-table-paging-numbers-wrapper").empty();

        //Nếu tổng số trang lớn hơn số button max để phân trang: => render số button max
        if (totalPage >= me.MaxPageIndexButton) {
          //Lấy index trang hiện tại
          let currPageIndex = me.CurrPageIndex;
          //Xác định xem trang hiện tại đang ở phạm vị nào
          // vd range 1 : 1->10:
          //    range 2 : 11->20:
          //Xác định button bắt đầu của range hiện tại
          let btnStartCurrRange;
          if (currPageIndex % me.MaxPageIndexButton > 0) {
            btnStartCurrRange =
              Math.floor(currPageIndex / me.MaxPageIndexButton) *
                me.MaxPageIndexButton +
              1;
          } else {
            btnStartCurrRange =
              Math.floor(currPageIndex / me.MaxPageIndexButton) *
                me.MaxPageIndexButton -
              me.MaxPageIndexButton +
              1;
          }

          for (let index = 0; index < me.MaxPageIndexButton; index++) {
            let buttonHTML = $(
              `<div class="t-table-paging-number">${btnStartCurrRange}</div>`
            );
            if (btnStartCurrRange <= totalPage) {
              //Active trang đang được chọn
              if (btnStartCurrRange == currPageIndex) {
                buttonHTML.addClass("t-table-paging-active");
              }
              //Thêm data value index cho mỗi button phân trang
              buttonHTML.attr("value", btnStartCurrRange);
              buttonHTML.data("value", btnStartCurrRange);
              $(
                ".t-table-paging-numbers .t-table-paging-numbers-wrapper"
              ).append(buttonHTML);
            }
            btnStartCurrRange++;
          }
        } else {
          //Nếu tổng số trang nhỏ hơn số button max để phân trang: => render số button=tổng số trang
          //Lấy index trang hiện tại
          let currPageIndex = me.CurrPageIndex;
          let btnStartCurrRange = 1;
          //start index luôn bằng 1
          //button end index luôn <=totalPage
          for (let index = 0; index < totalPage; index++) {
            let buttonHTML = $(
              `<div class="t-table-paging-number">${btnStartCurrRange}</div>`
            );
            //Active trang đang được chọn
            if (btnStartCurrRange == currPageIndex) {
              buttonHTML.addClass("t-table-paging-active");
            }
            //Thêm data value index cho mỗi button phân trang
            buttonHTML.attr("value", btnStartCurrRange);
            buttonHTML.data("value", btnStartCurrRange);
            $(".t-table-paging-numbers .t-table-paging-numbers-wrapper").append(
              buttonHTML
            );
            btnStartCurrRange++;
          }
        }

        //Duyệt từng item
        for (let index = 0; index < dataLength; index++) {
          let item = arrayData[index];
          //Template tr body
          let trBodyHTML = $(`<tr></tr>`);
          //Duyệt từng cols của table
          for (const th of ths) {
            //build td template
            const tdHTML = $("<td></td>");
            //WHAT: Get element by attr
            //Lấy attr từng th
            let fieldValue = $(th).attr("fieldValue");
            let fieldStatus = $(th).attr("fieldStatus");
            let fieldFunc = $(th).attr("fieldFunc");
            let formatType = $(th).attr("formatType");
            if (fieldStatus) {
              tdHTML.append(thCheck);
              tdHTML.attr("fieldStatus", fieldStatus);
            } else if (fieldFunc) {
              tdHTML.append(tdFunc);
              tdHTML.attr("fieldStatus", fieldFunc);
            } else {
              //gán giá trị cho fieldValue
              let value = item[fieldValue];
              //format
              switch (formatType) {
                case "date":
                  tdHTML.addClass("text-algin-center");
                  value = CommonJS.formatDateDDMMYYYY(value);
                  break;
                case "number":
                  tdHTML.addClass("text-algin-right");
                  break;
                default:
                  tdHTML.addClass("text-algin-left");
                  break;
              }
              //gán vào từng td
              tdHTML.text(value);
            }
            trBodyHTML.append(tdHTML);
          }
          //Gán id nhân viên vào data của mỗi tr
          trBodyHTML.data("EmployeeId", item.EmployeeId);
          //Gán nhân viên và data của mỗi tr
          trBodyHTML.data("Employee", item);
          $("table#tableEmployees tbody").append(trBodyHTML);
        }
      },
      error: function (error) {
        console.log(error);
      },
    });
  }
  /**
   * Hiển thị form nhập dữ liệu nhân viên
   * Author: NVTAM (30/11/2021)
   */
  addEmployeeOnClick() {
    this.FormMode = Enum.FormMode.Add;
    let me = this;
    //empty input
    let inputs = $("input[fieldName]");
    for (const input of inputs) {
      //empty value từng input
      $(input).val("");
    }

    //Hiển thị form nhập thông tin nhân viên
    $("#showDialog").show();
    let employeeCode = $("#employeeCode");
    employeeCode.focus();
    //lấy id nhân viên tiếp theo
    $.ajax({
      type: "GET",
      url: `${me.Url}/NewEmployeeCode`,
      success: function (idNew) {
        //add employee id vào input
        employeeCode.val(idNew);
      },
    });
  }

  escapeFormOnClick() {
    $("#showDialog").hide();
  }

  /**
   * Cất dữ liệu lên sever
   * Author: NVTAM (11/29/2021)
   */
  saveEmployeeOnClick() {
    let me = this;
    //validate dữ liệu
    let eleValidates = $("input[validate]");
    //sử dụng hàm tĩnh trong class
    let validateTrue = Validate.validateData(eleValidates);
    const employee = {};
    //Lấy dữ liệu từ combobox
    let comboboxs = $(".t-combobox");
    //duyệt từng combobox
    for (const combobox of comboboxs) {
      let attrValue = $(combobox).attr("fieldData");
      //lấy value của combobx hiên tại
      let value = $(combobox).attr("value");
      //kiểm tra nếu có cả value vào attr của cb thì mới gán dữ liệu cho employee
      if (attrValue && value) {
        employee[attrValue] = value;
      }
    }
    //Lấy dữ liệu qua input type=radio
    let radioGender = $("input[name=Gender]:checked");
    let valueGender = $(radioGender).val();
    //lấy attr của input radio
    let gender = $(radioGender).attr("name");
    employee[gender] = valueGender;

    //Lấy dữ liệu của input
    let inputs = $("input[fieldName]");
    //Duyệt từng input
    for (const input of inputs) {
      //get value từng input
      let value = $(input).val();
      //get attr từng input
      let fieldName = $(input).attr("fieldName");
      employee[fieldName] = value;
    }
    // cất dữ liệu lên API
    console.log(employee);
    if (validateTrue) {
      if (this.FormMode == Enum.FormMode.Add) {
        $.ajax({
          type: "POST",
          url: me.Url,
          data: JSON.stringify(employee),
          dataType: "json",
          async: false, //để cho chay đồng bộ hủy bỏ bất đồng bộ
          contentType: "application/json", //kiểu content type, response trả về dạng json
          success: function (response) {
            //Ẩn form nhập liệu
            $("#showDialog").hide();
            //hiển thị toast messenger
            me.showToastMessenger("#toastMessAdd");
            //load lại trang
            me.loadData();
          },
          error: function (error) {
            me.showErrorMessenger(error);
          },
        });
      } else if (this.FormMode == Enum.FormMode.Update) {
        $.ajax({
          type: "PUT",
          url: `${me.Url}/${me.EmployeeId}`,
          data: JSON.stringify(employee),
          dataType: "json",
          async: false, //để cho chay đồng bộ hủy bỏ bất đồng bộ
          contentType: "application/json", //kiểu content type, response trả về dạng json
          success: function (response) {
            //Ẩn form nhập liệu
            $("#showDialog").hide();
            //hiển thị toast messenger
            me.showToastMessenger("#toastMessUpDate");
            //load lại trang
            me.loadData();
          },
          error: function (error) {
            me.showErrorMessenger(error);
          },
        });
      }
    }
  }
  /**
   *Cất và thêm dữ liệu lên sever
   *Author: NVTAM (30/11/2021)
   */
  saveAddEmployeeOnClick() {
    this.saveEmployeeOnClick();
    this.addEmployeeOnClick();
    $("#showDialog").show();
  }
  /**
   *Sửa dữ liệu gửi lên sever
   *Author: NVTAM (30/11/2021)
   */
  update(sender) {
    this.FormMode = Enum.FormMode.Update;
    //Hiển thị form nhập thông tin nhân viên
    $("#showDialog").show();
    //tự động focus vào employeeCode
    let employeeCode = $("#employeeCode");
    employeeCode.focus();
    //Lấy thông tin của nhân viên cần sửa
    let currTr = $(sender.target).closest("tr");
    //Lấy id của nhân viên cần sửa
    let employeeId = $(currTr).data("EmployeeId");
    this.EmployeeId = employeeId;
    let employee = $(currTr).data("Employee");
    //Gán giá trị cho combobox
    let cbDepartment = $("#cbDepartment");
    let cbFieldData = cbDepartment.attr("fieldData");
    let cbFieldName = cbDepartment.attr("fieldName");
    if (cbFieldData || cbFieldName) {
      cbDepartment.attr("value", employee[cbFieldData]);
      //gán name vào input combobox
      let cbInput = cbDepartment.find("input");
      $(cbInput).val(employee[cbFieldName]);
    }
    //Gán giá trị vào input radio
    // 1.Lấy ra các input name=gender
    let inputsRadio = $('input[name="Gender"]');
    for (const inputRadio of inputsRadio) {
      //so sánh value
      let value = $(inputRadio).attr("value");
      if (value == employee.Gender) {
        inputRadio.checked = true;
      }
    }
    //Gán giá trị vào input text trong form
    let inputs = $("input[fieldName]");
    for (const input of inputs) {
      //get attr của input
      const fieldName = $(input).attr("fieldName");
      //Lấy dữ liệu của nhân viên được chọn render lên form
      let value = employee[fieldName];
      if (value) {
        $(input).val(value);
      }
    }
  }
  /**
   * hiển thị pop up Xóa dữ liệu
   * Author Nguyễn Văn Tâm (29/11/2021)
   */
  delete() {
    let me = this;
    $.ajax({
      type: "DELETE",
      url: `${me.Url}/${me.EmployeeId}`,
      async: false,
      success: function (response) {
        $("#showDialogDel").hide();
        me.showToastMessenger("#toastMessDel");
        me.loadData();
      },
    });
  }
  /**
   * Ẩn list menu delete
   * Author Nguyễn Văn Tâm (2/12/2021)
   */
  addEventClickToWindow() {
    window.addEventListener("click", (e) => {
      // if the clicked element is not option btn => close menu
      if (
        !e.target.classList.contains("t-row-more-down") &&
        !e.target.classList.contains("t-row-list")
      ) {
        $("#listOption").hide();
      }
    });
  }
  /**
   * Hiển thị toast messenger
   * Author NVTAM (2/12/2021)
   */
  showToastMessenger(selector) {
    $(selector).fadeIn("slow");
    $(selector).show();
    setTimeout(() => {
      $(selector).hide();
    }, 2000);
  }
  /**
   * Show error messenger từ sever gửi về
   * Author NVTAM(3/12/2021)
   */
  showErrorMessenger(error) {
    switch (error.status) {
      case 500:
        //Lỗi bên sever
        $("#showDialogError").show();
        $("#showDialogError .pop-up-text").text(error.responseJSON.userMsg);
        break;
      case 405:
        //Lỗi phía client
        $("#showDialogError").show();
        $("#showDialogError .pop-up-text").text("Đường dẫn không hợp lệ!");
        break;
      case 400:
        //Lỗi phía client
        $("#showDialogError").show();
        $("#showDialogError .pop-up-text").text(error.responseJSON.userMsg);
        break;
      default:
        break;
    }
  }
}
