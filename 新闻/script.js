/* 
  项目：汽车上市信息列表
  作者：梁铭巨
  说明：标签切换交互 + 数据渲染
*/

// 梁铭巨：最新上市数据（一比一还原参考图片）
var lmj_newCarList = [
    { date: "12月13日", model: "沃尔沃S60L", price: "26.99-38.49" },
    { date: "12月12日", model: "捷豹人马龙腾典藏", price: "47.99-59.99" },
    { date: "12月10日", model: "一汽大众高尔夫7", price: "11.89-18.29" },
    { date: "12月8日", model: "2014款古思特", price: "419.0-666.0" },
    { date: "12月5日", model: "起亚新款K5", price: "15.98-28.18" },
    { date: "12月5日", model: "2014款奥德赛", price: "22.98-28.68" }
];

// 梁铭巨：即将上市数据（示例数据）
var lmj_upcomingCarList = [
    { date: "12月20日", model: "宝马全新X5", price: "85.0-105.0" },
    { date: "12月18日", model: "奔驰GLA 2015款", price: "28.98-39.98" },
    { date: "12月15日", model: "奥迪A6L 改款", price: "38.5-74.5" }
];

/**
 * 梁铭巨：渲染汽车列表到指定容器
 * @param {string} lmj_containerId - 容器ID
 * @param {Array} lmj_data - 汽车数据数组
 */
function lmj_renderCarList(lmj_containerId, lmj_data) {
    var lmj_container = document.getElementById(lmj_containerId);
    if (!lmj_container) return;

    // 梁铭巨：清空容器
    lmj_container.innerHTML = "";

    // 梁铭巨：遍历数据生成行
    for (var i = 0; i < lmj_data.length; i++) {
        var lmj_item = lmj_data[i];

        // 梁铭巨：创建行元素
        var lmj_row = document.createElement("div");
        lmj_row.className = "lmj_row";

        // 梁铭巨：上市时间单元格
        var lmj_tdDate = document.createElement("div");
        lmj_tdDate.className = "lmj_td lmj_td_date";
        lmj_tdDate.textContent = lmj_item.date;

        // 梁铭巨：品牌/车型单元格
        var lmj_tdModel = document.createElement("div");
        lmj_tdModel.className = "lmj_td lmj_td_model";
        lmj_tdModel.textContent = lmj_item.model;

        // 梁铭巨：售价单元格
        var lmj_tdPrice = document.createElement("div");
        lmj_tdPrice.className = "lmj_td lmj_td_price";
        lmj_tdPrice.textContent = lmj_item.price;

        // 梁铭巨：组装行
        lmj_row.appendChild(lmj_tdDate);
        lmj_row.appendChild(lmj_tdModel);
        lmj_row.appendChild(lmj_tdPrice);

        // 梁铭巨：添加到容器
        lmj_container.appendChild(lmj_row);
    }
}

/**
 * 梁铭巨：标签切换函数
 * @param {string} lmj_tabId - 被点击的标签ID
 */
function lmj_switchTab(lmj_tabId) {
    // 梁铭巨：获取所有标签和面板
    var lmj_tabs = document.querySelectorAll(".lmj_tab");
    var lmj_panels = document.querySelectorAll(".lmj_panel");

    // 梁铭巨：先隐藏所有面板，移除所有标签选中态
    for (var i = 0; i < lmj_tabs.length; i++) {
        lmj_tabs[i].classList.remove("lmj_tab_active");
    }
    for (var j = 0; j < lmj_panels.length; j++) {
        lmj_panels[j].classList.remove("lmj_panel_active");
    }

    // 梁铭巨：激活当前标签
    var lmj_currentTab = document.getElementById(lmj_tabId);
    lmj_currentTab.classList.add("lmj_tab_active");

    // 梁铭巨：激活对应面板
    var lmj_targetPanelId = lmj_currentTab.getAttribute("data-target");
    var lmj_targetPanel = document.getElementById(lmj_targetPanelId);
    lmj_targetPanel.classList.add("lmj_panel_active");
}

/**
 * 梁铭巨：页面初始化
 */
function lmj_init() {
    // 梁铭巨：渲染两个面板的数据
    lmj_renderCarList("lmj_table_body_new", lmj_newCarList);
    lmj_renderCarList("lmj_table_body_upcoming", lmj_upcomingCarList);

    // 梁铭巨：绑定标签点击事件
    document.getElementById("lmj_tab_new").addEventListener("click", function () {
        lmj_switchTab("lmj_tab_new");
    });
    document.getElementById("lmj_tab_upcoming").addEventListener("click", function () {
        lmj_switchTab("lmj_tab_upcoming");
    });
}

// 梁铭巨：DOM加载完成后执行初始化
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", lmj_init);
} else {
    lmj_init();
}
