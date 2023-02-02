interface ITemp {
    web: { title: string, logo: string, url: string }[]
    name: string | null
    children: ITemp[]
}

/**
 * 把 String 转换为 DOM 对象
 * @param str
 * @returns {NodeListOf<ChildNode>}
 */
export const parseToDOM = (str: string) => {
    const div = document.createElement("div");
    div.innerHTML = str;
    return div.childNodes;
};

/**
 * 文本处理函数
 * @param dl
 * @param temp
 */
export const textHandle = (dl: HTMLDListElement, temp: ITemp | null) => {
    const dts = getDts(dl);
    if (dts.length > 0) {
        for (const i in dts) {
            const dt = dts[i];
            const hdl = getTag(dt, "DL");
            if (hdl !== null) {
                const h = getTag(dt, "H3") as HTMLHeadingElement;
                const returns = textHandle(hdl as HTMLDListElement, {
                    name: h.textContent,
                    children: [],
                    web: [],
                });
                if (temp === null) {
                    temp = returns;
                } else if (returns) {
                    temp.children.push(returns);
                }
            } else {
                const a = getTag(dt, "A") as HTMLAnchorElement;
                temp &&
                temp.web.push({
                    url: a.href,
                    title: a.textContent as string,
                    logo: a.getAttribute("ICON") as string,
                });
            }
        }
    }
    return temp;
};

/**
 * 获取 DL 下面的 DT 标签
 * @param dl
 * @returns
 */
const getDts = (dl: HTMLDListElement) => {
    const dlcs = dl.children;
    const arr: any = [];
    if (dlcs.length < 1) {
        return arr;
    }

    for (const dlc of dlcs) {
        if (dlc.nodeName.toUpperCase() === "DT") {
            arr.push(dlc);
        }
    }

    return arr;
};

/**
 * 获取 DT 下面的标签
 * @param dt
 * @param nodeName
 * @returns
 */
const getTag = (dt: HTMLElement, nodeName: string) => {
    const dtcs = dt.children;
    let obj = null;
    if (dtcs.length < 1) {
        return obj;
    }

    for (const dtc of dtcs) {
        if (dtc.nodeName.toUpperCase() === nodeName) {
            obj = dtc;
            break;
        }
    }
    return obj;
};

/**
 * 复制文本到剪切板
 * @param text
 * @param callback
 */
export const copy = (text: string, callback: () => void) => {
    const textArea = document.createElement("textarea");
    textArea.setAttribute("readonly", "readonly");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    const res = document.execCommand("Copy");
    document.body.removeChild(textArea);
    res && callback();
};
