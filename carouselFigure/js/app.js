$(function () {
    //获取最外层div
    var $container = $('#container');
    //获取放所有图片的div
    var $imgList = $('#list');
    //获取所有操作图片的圆点
    var $pointsDiv = $('#pointsDiv>span');
    //获取翻页的按钮
    var $prev = $('#prev');
    var $next = $('#next');
    //一张图片的宽度(播一页的宽度)
    var PAGE_WIDTH = 600;
    //定义一个平缓播动的总时间
    var TIME = 400;
    //定义一个播动的时间间隔
    var ITEMS_TIME = 20;
    var imgCount = 5;
    //初始化小圆点的下标
    var index = 0

    //是否滑动中
    var isMoving = false;


    $prev.click(function () {
        nextPage(false);
    });
    $next.click(function () {
        nextPage(true);
    });

    function nextPage(flag) {
        //debugger;
        if (isMoving) {
            return;
        }
        isMoving = true;
        var offset = 0;
        if (typeof flag === 'boolean') {
            //获取偏移量 每一页要偏移多少  值是正值还是负值
            offset = flag ? -PAGE_WIDTH : PAGE_WIDTH;
        } else {
            offset = -(flag - index) * PAGE_WIDTH;
        }
        //计算每一次间隔的偏移量
        var itemOffset = offset / (TIME / ITEMS_TIME);
        //获取图片列表的当前位置
        var currentOffset = $imgList.position().left;
        //定义一个目标位置
        var targetOffset = currentOffset + offset;
        //开启定时器开始平缓滑动图片
        var timer = setInterval(function () {
            //让当前位置偏移量加或减去每次间隔的便宜量
            //debugger;
            currentOffset += itemOffset;
            if (targetOffset === currentOffset) {
                clearInterval(timer);
                if (currentOffset === -(imgCount + 1) * PAGE_WIDTH) {
                    currentOffset = -PAGE_WIDTH;
                } else if (currentOffset === 0) {
                    currentOffset = -imgCount * PAGE_WIDTH;
                }
                isMoving = false;
            }
            $imgList.css('left', currentOffset);
        }, ITEMS_TIME);

        updatePoints(flag);
    };

    function updatePoints(flag) {
        var targetPoint = 0;
        if (typeof flag === 'boolean') {
            //定义目标小圆点
            targetPoint = index + (flag ? 1 : -1);
        } else {
            targetPoint = flag;
        }

        //判断小圆点如果到最后一个再往后点则让他到第一个 如果到第一个再往前点  让他等于最后一个
        if (targetPoint !== index) {
            if (targetPoint === imgCount) {
                targetPoint = 0;
            } else if (targetPoint < 0) {
                targetPoint = imgCount - 1;
            }
            //给目标小圆点加亮点
            $pointsDiv[targetPoint].className = 'on';
            //给之前的小圆点去掉亮点
            $pointsDiv[index].className = '';
            //更新小圆点的下标
            index = targetPoint;
        }


    }

    //自动轮播图片,每隔2秒换一张图片
    var auto = setInterval(function () {
        nextPage(true);
    }, 2000);
    //鼠标移入定时器停止   移出定时器开启
    $container.hover(function () {
        clearInterval(auto);
    }, function () {
        auto = setInterval(function () {
            nextPage(true);
        }, 2000);
    })

    //点击小圆点图片进行轮播
    $pointsDiv.click(function () {
        var currentIndex = $(this).index();
        nextPage(currentIndex);
    });


});
