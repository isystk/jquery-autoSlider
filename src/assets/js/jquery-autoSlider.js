(function ($) {
    /*
     * 自動スライダー
     * 
     * Copyright (c) 2024 iseyoshitaka
     */
    $.fn.autoSlider = function (options) {

        const settings = $.extend({}, $.fn.autoSlider.defaults, options);

        let isHover = false;
        const init = function (target) {
            const parent = target.find(settings.parentKey);
            let children = parent.find(settings.childKey);

            // children配列をforEachでループしながらChildのWidthを合計する
            let parentWidth = 0;
            for(let i = 0; i < children.length; i++) {
                parentWidth += children.eq(i).outerWidth(true);
            }
            
            const maxPageNo = children.length;
            let currentPageNo = 1;
            
            // CSS調整
            parent.css({
                position: 'relative',
                width: parentWidth + 'px',
                'overflow-x': 'hidden'
            });
            
            parent.hover(function () {
                isHover = true;
            }, function () {
                isHover = false;
            })
            
            const animation = function () {
                const currentPage = children.eq(currentPageNo-1);
                let left = 0;
                const to =  -1 * currentPage.outerWidth(true);

                const timer = setInterval(function () {
                    if (isHover) {
                        // ホバー中はアニメーションを停止させる
                        return;
                    }
                    if (to >= left) {
                        clearInterval(timer);
                        parent.append(currentPage.clone());
                        currentPage.remove();
                        parent.css('left', 0);
                        currentPageNo++;
                        if (maxPageNo < currentPageNo) {
                            currentPageNo = 1;
                            children = parent.find(settings.childKey);
                        }
                        animation();
                        return;
                    }
                    left--;
                    parent.css('left', left + 'px');
                }, settings.animationSpeed);
            } 
            animation();
        }

        // 処理開始
        $(this).each(function () {
            init($(this));
        });

        return this;
    };

    // デフォルト値
    $.fn.autoSlider.defaults = {
        parentKey: 'ul', // 親要素
        childKey: 'li', // 子要素
        animationSpeed: 10 // アニメーション速度
    };

})(jQuery);
