import { CategoryList } from "../interfases";

function getCategoryList(arrCategory:Array<CategoryList>, parentID:number = 0) {
    let arrResult:Array<CategoryList> = [];
    for(let i = 0; i < arrCategory.length; i++){
        if (arrCategory[i]['parentID'] == parentID) {
            arrResult.push(arrCategory[i]);
        }
    }
    if (arrResult.length > 0) {
        return arrResult;
    }
    else {
        return false;
    }
}

export function categoryOPT(categoryList:Array<CategoryList>, parentID:number = 0, space:string = "") {
    let html2 = "";
    let arrCategory = getCategoryList(categoryList, parentID);
    if(arrCategory) {
        for(let i = 0; i < arrCategory.length; i++) {
            let subHtml2 = categoryOPT(categoryList, arrCategory[i]['ID'], space + "&nbsp;&nbsp;");
            html2 += space + `<option value="${arrCategory[i]['ID']}">${arrCategory[i]['name']}</option>`;
            if (subHtml2) {
                html2 += subHtml2;
            }
        }
        return html2;
    }
    else {
        return false;
    }
}

export function categoryUL(categoryList:Array<CategoryList>, parentID:number = 0, space:string = "") {
    let html = "";
    let arrCategory = getCategoryList(categoryList, parentID);
    if(arrCategory) {
        if (parentID > 0) {
            html += "<ul>";
        }
        for(let i = 0; i < arrCategory.length; i++) {
            html += `<li class="folder"><a href="#" categoryID="${arrCategory[i]['ID']}">${arrCategory[i]['name']}</a>`;
            let subHtml = categoryUL(categoryList, arrCategory[i]['ID'], space + "&nbsp;&nbsp;");
            if(subHtml) {
                html+= subHtml;
            }
            html += `</li>`;

        }
        if (parentID > 0) {
            html += "</ul>";
        }
        return html;
    }
    else {
        return false;
    }
}