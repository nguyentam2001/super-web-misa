$(document).ready(function () {
  new Combobox();
});

class Combobox {
  value = null;
  constructor() {
    //load data vào combobox
    this.buildListItem();
    //Lưu trữ combobox item để lọc
    this.saveCbItem();
    this.initEvent();
    //set combobx default paging
    this.setItemDefaultPaging();
  }

  initEvent() {
    $(".t-combobox-btn").click(this.showListItemOnClick.bind(this));
    $(".t-combobox-list").on(
      "click",
      ".t-combobox-item",
      this.setValueItemOnClick.bind(this)
    );
    //lọc dữ liệu
    $(".t-combobox input").keyup(this.filterDataOnKeyup.bind(this));
    //chuyển đổi qua lại các item khi nhấn nút lên xuống
    $(".t-combobox input").keydown(this.handleItemsOnKeydown.bind(this));
    //Disable sự kiện keyup và key down trên input cb paging
    $("#cbxPageSize input").on("keydown", this.disableKeyUpKeyDown);
    $("#cbxPageSize input").on("keyup", this.disableKeyUpKeyDown);
    //bắt sự kiện rotate khi nhân btn cb paging
    $("#cbxPageSize .t-combobox-btn").click(this.handleRotateBtnPaging);
  }

  handleRotateBtnPaging() {
    if ($(this).hasClass("active-up")) {
      $(this).removeClass("active-up");
    } else {
      $(this).addClass("active-up");
    }
  }
  /**
   *  Disable sự kiện keyup và key down trên input cb paging
   * Author: Nguyễn Văn Tâm (3/12/2021)
   */

  disableKeyUpKeyDown(sender) {
    sender.preventDefault();
    return false;
  }

  /**
   * buid dữ liệu từ localStorage vào combobox
   * Author: NVTAM (30/11/2021)
   */
  buildListItem() {
    //load tất cả các combobox
    let comboboxs = $("combobox");
    for (const combobox of comboboxs) {
      //Lấy attr combobox
      let comboboxId = $(combobox).attr("id");
      let fieldData = $("combobox").attr("fieldData");
      let fieldName = $("combobox").attr("fieldName");
      let api = $("combobox").attr("api");
      //template combobox
      let cbHTML = $(`
      <div id="${comboboxId || ""}" fieldData="${fieldData || ""}" fieldName="${
        fieldName || ""
      }" class="t-combobox">
        <input
          class="t-input t-combobox-input"
          type="text"
          placeholder="Phòng ban"
          validate="Department"
        />
        <button class="t-combobox-btn" tabindex="-1"></button>
        <div class="t-combobox-list">
        </div>
        </div>
        `);
      if (api && fieldName && fieldData) {
        $.ajax({
          type: "GET",
          url: api,
          async: false,
          success: function (data) {
            //duyệt qua từng data
            for (const item of data) {
              //lấy id của từng item
              let itemId = item[fieldData];
              //lấy name của từng item
              let itemName = item[fieldName];
              //buid combobox item
              let cbItemHTML = `
                <div class="t-combobox-item" value=${itemId}>${itemName}</div>
                `;
              cbHTML.find(".t-combobox-list").append(cbItemHTML);
            }
          },
        });
      } else if (comboboxId == "cbxPageSize") {
        let items = $(combobox).children();
        for (const item of items) {
          //Lấy ra value của combobox
          let value = $(item).attr("value");
          let itemDefault = $(item).attr("ItemDefault");
          //Lấy ra text của combobox
          let text = $(item).text();
          //buid combobox item
          let cbItemHTML = $(`
          <div class="t-combobox-item" value=${value}>${text}</div>
          `);
          if (itemDefault) {
            cbItemHTML.attr("ItemDefault", itemDefault);
          }

          cbHTML.find(".t-combobox-list").append(cbItemHTML);
        }
      }
      $(combobox).replaceWith(cbHTML);
    }
  }
  /**
   * Lưu trữ các element dữ liệu vào combobox
   * Author: NVTAM (30/11/2021)
   */
  saveCbItem() {
    let comboboxs = $(".t-combobox");
    for (const combobox of comboboxs) {
      let comboboxItems = $(combobox).find(".t-combobox-list").html();
      $(combobox).data("itemDataElements", comboboxItems);
    }
  }
  /**
   * Lọc data on keyup
   * Author: NVTAM (30/11/2021)
   */
  filterDataOnKeyup(sender) {
    console.log(sender.keyCode);
    if (
      (sender.keyCode > 64 && sender.keyCode < 91) ||
      sender.keyCode == 32 || //khoảng trắng
      sender.keyCode == 8 //nút backspace
    ) {
      let currInput = $(sender.target);
      //lấy value hiện tại
      let value = currInput.val();
      //lấy combobox hiện tại
      let currCb = currInput.closest(".t-combobox");
      let listItem = currInput.siblings(".t-combobox-list");
      //Cho trống tất cả các combobox
      $(listItem).empty();
      //Lấy ra data lưu vào combobox
      let itemDataElements = $(currCb).data("itemDataElements");
      //Chuyển đổi về html node
      const comboboxItems = $.parseHTML(itemDataElements);
      //duyệt qua tất cả các item của combobox
      for (const item of comboboxItems) {
        //lấy text của element
        let text = $(item).text();
        //kiểm tra với giá trị nhập
        if (!text.toLowerCase().includes(value.toLowerCase())) {
          $(item).remove();
        } else {
          $(listItem).append(item);
        }
      }
      //Kiểm tra xem có phần tử con nào không thì cho ẩn hiện list
      let items = $(listItem).children();
      if (items.length == 0) {
        $(listItem).hide();
      } else {
        $(listItem).show();
      }
    }
  }
  /**
   * Sử lý sự kiện khi nhấn nút lên xuống và enter
   * Author: NVTAM (30/11/2021)
   */

  handleItemsOnKeydown(sender) {
    let currInput = $(sender.target);
    //Lấy ra list item
    let listItem = currInput.siblings(".t-combobox-list");
    //Show list item
    $(listItem).show();
    //Lấy ra các item
    let items = $(listItem).children();
    //Kiểm tra xem đã có thằng nào có class active chưa chưa
    let itemsActive = $(items).filter(".t-combobox-item.item-active");
    //add class active vào từng item
    switch (sender.keyCode) {
      case 40:
        if (itemsActive.length <= 0) {
          //Thêm class active vào đầu tiên
          $(items[0]).addClass("item-active");
        } else {
          //lấy phần tử đang active hiện tại
          let CurrItem = $(".t-combobox-item.item-active");
          //Thêm class active vào ele tiếp theo
          let nextItem = CurrItem.next();
          $(nextItem).addClass("item-active");
          //Xóa class active ở ele hiện tại
          $(CurrItem).removeClass("item-active");
        }

        break;
      case 38:
        if (itemsActive.length <= 0) {
          //Thêm class active vào đầu tiên
          $(items[items.length - 1]).addClass("item-active");
        } else {
          //lấy phần tử đang active hiện tại
          let CurrItem = $(".t-combobox-item.item-active");
          //Thêm class active vào ele tiếp theo
          let nextItem = CurrItem.prev();
          $(nextItem).addClass("item-active");
          //Xóa class active ở ele hiện tại
          $(CurrItem).removeClass("item-active");
        }

        break;

      case 13:
        if (itemsActive.length == 1) {
          //lấy phần tử đang active hiện tại
          let currItem = $(".t-combobox-item.item-active");
          //lấy giá trị và text gán vào combobox và input
          this.setValueCb(currItem);
        }
        break;

      default:
        break;
    }
  }

  /**
   * Sự kiện click vào button và show list item
   * Author NVTAM (30/11/2021)
   */
  showListItemOnClick(sender) {
    let btn = $(sender.target);
    //Hiển thị list item
    let listItem = $(btn).siblings(".t-combobox-list");
    $(listItem).toggle();
  }
  /**
   * Gán giá trị được chọn vào combobox
   * Author: NVTAM (30/11/2021)
   */
  setValueItemOnClick(sender) {
    let currElement = $(sender.target);
    this.setValueCb(currElement);
  }
  /**
   * lấy giá trị và text gán vào combobox và input
   * Author: NVTAM (30/11/2021)
   */
  setValueCb(currElement) {
    //Lấy text
    let textItem = currElement.text();
    //Tìm input
    let listItem = currElement.closest(".t-combobox-list");
    let input = listItem.siblings("input");
    //Lấy text được chọn gán vào input
    $(input).val(textItem);
    //lấy value item
    let value = currElement.attr("value");
    //Lấy giá trị được chọn gán vào combobox
    let combobox = currElement.closest(".t-combobox");
    $(combobox).attr("value", value);
    console.log(`value`, value);
    //gán vào data
    $(combobox).data("value", value);
    //Ẩn list combobox
    $(listItem).hide();
    //Kiểm tra thuộc tính rotate của btn
    //1.Lấy ra btn hiện tại chứa thuộc tính rotate
    let btnRotate = $(listItem).siblings(".active-up");
    if (btnRotate) {
      //xóa class active up
      $(btnRotate).removeClass("active-up");
    }
  }
  /**
   * Lấy item default trong paging
   * Author: NVTAM (30/11/2021)
   */
  setItemDefaultPaging() {
    let cbxPageSize = $("#cbxPageSize");
    // lấy ra tất cả các items
    let items = cbxPageSize.find(".t-combobox-item");
    for (const item of items) {
      //lấy attr default của item
      let attrDefault = $(item).attr("itemdefault");
      if (attrDefault) {
        //Lấy input element
        let input = cbxPageSize.find("input");
        //Lấy text của item hiện tại
        let text = $(item).text();
        //gán vào input
        $(input).val(text);
        //lấy value element hiện tại
        let value = $(item).attr("value");
        //Lấy giá trị được chọn gán vào combobox
        $(cbxPageSize).attr("value", value);
        //gán vào data
        $(cbxPageSize).data("value", value);
      }
    }
  }
}
