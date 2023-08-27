import request from "../helpers/ajax";
import { CategoryList } from "../interfases";

let markAddCategoryListEl = document.getElementById("markAddCategoryList");

export async function updateCategoryList() {
    let result = await request("/poi/category", {}, "get") as Array<CategoryList>;
    if(result) {
        //@ts-ignore
        markAddCategoryListEl?.innerHTML = "";
        for(let i = 0; i < result.length; i++) {
            let opt = document.createElement("option") as HTMLOptionElement;
            opt.value = result[i].ID.toString();
            opt.text = result[i].name;
            markAddCategoryListEl?.appendChild(opt);
        }
    }
}