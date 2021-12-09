$(document).ready(function () {
  new Table();
});

class Table {
  constructor() {
    //Build vào table
    this.buildTable();
  }
  /**
   * Tạo thư viện table
   * Author: Nguyễn Văn Tâm (28/11/2021)
   */
  buildTable() {
    //lấy các table trong page
    let tables = $("ttable");
    //duyệt qua từng table
    for (const table of tables) {
      //lấy id của table
      const tableID = $(table).attr("id");
      //template table build
      let tableHTML = $(`
    <table id="${tableID || ""}" class="t-table" border="1">
                    <thead>
                      
                    </thead>
                    <tbody>
                      
                    </tbody>
                  </table>
    `);
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
      //lấy các tcol
      let tcols = $(table).children();
      let trHTML = $(`<tr></tr>`);
      //buid header
      //duyệt từng tcol
      for (const tcol of tcols) {
        //build th
        let thHTML = $(`<th></th>`);
        //lấy text từng tcol
        let textCol = tcol.textContent;
        //Lấy attr từng tcol
        let fieldValue = $(tcol).attr("fieldValue");
        let fieldStatus = $(tcol).attr("fieldStatus");
        let fieldFunc = $(tcol).attr("fieldFunc");
        let formatType = $(tcol).attr("formatType");
        //gán vào từng th
        if (fieldStatus == "checkBox") {
          thHTML.attr("fieldStatus", fieldStatus);
          thHTML.append(thCheck);
        } else if (fieldFunc == "function") {
          thHTML.text("Chức năng");
          thHTML.attr("fieldFunc", fieldFunc);
        } else {
          thHTML.attr("fieldValue", fieldValue);
          if (formatType) {
            thHTML.attr("formatType", formatType);
          }
          //format
          switch (formatType) {
            case "date":
              thHTML.addClass("text-algin-center");

              break;
            case "number":
              thHTML.addClass("text-algin-right");
              break;
            default:
              thHTML.addClass("text-algin-left");
              break;
          }
          thHTML.text(textCol);
        }
        trHTML.append(thHTML);
      }
      //gán vào thead
      tableHTML.find("thead").append(trHTML);
      //build tbody
      let api = $(table).attr("api");
      //lấy dữ liệu qua ajax
      if (api) {
        $.ajax({
          type: "GET",
          url: api,
          async: false,
          success: function (data) {
            //duyệt qua từng item
            for (const item of data) {
              //Template tr body
              let trBodyHTML = $(`<tr></tr>`);
              //Duyệt từng cols của table
              for (const tcol of tcols) {
                //build td template
                const tdHTML = $(`<td></td>`);
                //get attr của từng col
                //Lấy attr từng tcol
                let fieldValue = $(tcol).attr("fieldValue");
                let fieldStatus = $(tcol).attr("fieldStatus");
                let fieldFunc = $(tcol).attr("fieldFunc");
                let formatType = $(tcol).attr("formatType");
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
              tableHTML.find("tbody").append(trBodyHTML);
            }
          },
        });
      }
      $(table).replaceWith(tableHTML);
    }
  }
  addEventClickToWindow() {}
}
