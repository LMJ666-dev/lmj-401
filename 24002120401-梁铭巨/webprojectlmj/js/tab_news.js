/*
  作者：梁铭巨
  建立时间：2026-11-04
  使用大模型：GLM-5.3-Flash
  功能名称：可复用 Tab 选项卡组件（js/tab_news.js）
  说明：lmj_initTabs 只需传入选项卡容器的选择器即可完成初始化，
        同一页面可对不同容器多次调用，实现组件复用。
*/
(function () {
    'use strict';

    /**
     * 函数功能：初始化一个可复用的 Tab 选项卡组件。
     *          遍历容器内所有 .lmj_tab，为每个选项卡绑定点击监听事件；
     *          点击后先清除所有选项卡的选中状态，再设置当前元素为选中，
     *          并根据 data-lmj_tab 与 data-lmj_panel 的对应关系显示内容面板。
     * @param {string} groupSelector 选项卡容器的 CSS 选择器，如 "#lmj_newsTabs"
     */
    function lmj_initTabs(groupSelector) {
        var group = document.querySelector(groupSelector);
        if (!group) return;

        var tabs = group.querySelectorAll('.lmj_tab');
        var panels = group.querySelectorAll('.lmj_panel');

        tabs.forEach(function (tab) {
            // 监听事件：点击选项卡时触发切换
            tab.addEventListener('click', function () {
                // 第一步：先清除所有选项卡的选中状态
                tabs.forEach(function (t) {
                    t.classList.remove('lmj_active');
                });
                // 同时隐藏所有内容面板
                panels.forEach(function (p) {
                    p.classList.remove('lmj_active');
                });

                // 第二步：再设置当前元素（本次点击的选项卡）的选中状态
                this.classList.add('lmj_active');

                // 显示与当前选项卡对应的内容面板
                var targetName = this.getAttribute('data-lmj_tab');
                var targetPanel = group.querySelector(
                    '.lmj_panel[data-lmj_panel="' + targetName + '"]'
                );
                if (targetPanel) {
                    targetPanel.classList.add('lmj_active');
                }
            });
        });
    }

    /**
     * 函数功能：页面加载完成后，初始化页面中需要用到的选项卡组；
     *          若其他页面也要使用选项卡，只需再次调用 lmj_initTabs 传入其他容器选择器即可复用。
     */
    document.addEventListener('DOMContentLoaded', function () {
        lmj_initTabs('#lmj_newsTabs');   // 新闻选项卡
        // 示例：lmj_initTabs('#lmj_otherTabs'); 可继续初始化其他选项卡组
    });
})();
