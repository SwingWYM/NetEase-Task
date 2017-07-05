// 公用
function $(id) {
    return document.getElementById(id);
}
function getEventTag(a){
    var e = a||window.event;
    return e.target || e.srcElement;
}

function bind(elem,type,fn){
    if(elem.attachEvent){
        elem.attachEvent('on' + type,fn);
    }
    if(elem.addEventListener){
        elem.addEventListener(type,fn,true);
    }
}
function getElementsByClassName(element, names) {
            if (element.getElementsByClassName) {
                return element.getElementsByClassName(names);
            } else {
                var elements = element.getElementsByTagName('*');
                var result = [];
                var element,
                    classNameStr,
                    flag;
                names = names.split(' ');
                for (var i = 0; element = elements[i]; i++) {
                    classNameStr = ' ' + element.className + ' ';
                    flag = true;
                    for (var j = 0, name; name = names[j]; j++) {
                        if (classNameStr.indexOf(' ' + name + '') == -1) {
                            flag = false;
                            break;
                        }
                    }
                    if (flag) {
                        result.push(element);
                    }
                }
                return result;
            }
        }



// 不再提醒效果

    /*
    * 设置一个cookie
    * @param name
    *        cookie名字
    * @param value
    *        cookie值
     */
function setCookie(name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days*24*60*60*1000);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}

    /*
    * 查询cookie，返回cookie值
    * @param name
    *        cookie名字
     */
function getCookie(name)
{
    var arr;
    var reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
    if(arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    } else{
        return null;
    }
}

    /*
    * 删除一个cookie
    * @param name
    *        cookie名字
     */
function delCookie(name)
{
    var exp = new Date();
    exp.setTime(exp.getTime() - 1);
    var cval = getCookie(name);
    if(cval !== null)
        document.cookie= name + "="+cval+";expires="+exp.toGMTString();
}

    /*
    * 网页加载好之后判断是否要显示顶部通知栏。如果没有查找到一个名为nomore的cookie，那么久显示顶部通知栏。
     */
function checkTop() {
    var noMore = getCookie("nomore");
    //没有读取到cookie的时候就会显示top。读取到就不管。
    if(!noMore){
        displayTop();
    }
}

    /*
    * 显示顶部通知栏，如果有名为nomore的cookie，就删掉！
    * 删掉的原因：在数据更新之后可以直接调用displayTop()来显示通知栏，不用管设置了cookie没。
    * 如果要设置对应通知的开关，则应当用通知的id来作为cookie的name，稍作修改即可。
     */
function displayTop() {
    var mTop = $("m-top");
    mTop.style.display="block";
    // if (getCookie("nomore")) {
    //     delCookie("nomore");
    // }
}

    /*
    * 隐藏顶部通知栏，直接设置display为none即可。
    * 要暴力点还可以直接把div节点删除掉，如果这样到时候再显示的时候会比较麻烦，所以直接隐藏起来即可。
     */
function hideTop() {
    var mTop = $("m-top");
    mTop.style.display="none";
}

    /*
    * 点击“不再显示”触发的事件，设置cookie，并且同时隐藏顶部通知栏。
     */
function noMoreTop() {
    setCookie("nomore", "1");
    hideTop();
}

    //绑定“不在显示”元素和事件。
var doNotShowTop = $("nomore");
bind(doNotShowTop,'click',noMoreTop);

    //顶部通知栏默认是不显示的，每次网页加载完毕之后，通过调用checkTop()函数来判断是否要显示通知栏。
    //顶部通知栏不能默认显示，会造成闪一下就没了的情况！！
checkTop();

// 放大镜的hover变化

var search = $("search");
bind(search,'mouseover',searchesin);
bind(search,'mouseout',searchesout);
function searchesin(e){
    var target = getEventTag(e);
    var search = $('img');
    search.src = 'img/search2.png';
}
function searchesout(e){
    var target = getEventTag(e);
    var search = $('img');
    search.src = 'img/search.png';
}

// 视频播放弹窗
    /**视频**/

var hideVideoButton = $('hideVideoButton');
var showVideoBlock = function(){
    var video = $('videoBlock');
    video.style.display = 'block';
    var videoSource = $('introVideoSource');
    videoSource.src='http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4';
};
var hideVideoBlock = function() {
    var video = $('introVideo');
    var videoBlock = $('videoBlock');
    videoBlock.style.display = "none";
    if (video.pase && !video.paused) {
        video.currentTime = 0;
        video.pause();
    }
};
bind(hideVideoButton, 'click', hideVideoBlock);
bind($('video'),'click',showVideoBlock);


// 登陆弹窗和关注
    /**登录**/
var followButton = $('yes');
var loginButton = $('submitLogin');
var cancelLoginButton = $('cancelLogin');

var hideLoginForm = function() {
    var loginForm = $('login');
    loginForm.style.display = 'none';
};

var loginButtonDown = function() {
    var loginButton = $('submitLogin');
    loginButton.style.backgroundImage = "url('img/button.png')";
};

var loginButtonUp = function() {
    var loginButton = $('submitLogin');
    loginButton.style.backgroundImage = 'none';
};

var login = function() {
    var loginForm = $('login');
    var userId = hex_md5(eval($('userId')).value);
    var userPassword = hex_md5(eval($('userPassword')).value);
    loginForm.style.display = 'none';
    var ajaxHttp = new XMLHttpRequest();
    //处理URL
    //用户名密码需要MD5加密
    var url = "http://study.163.com/webDev/login.htm?userName=" + userId+ "&password=" + userPassword;
    ajaxHttp.open("GET", url, true);
    ajaxHttp.send();
    ajaxHttp.onreadystatechange = function()
    {
        if (ajaxHttp.readyState==4 && ajaxHttp.status==200)
        {
            //handle the response: ajaxHttp.responseText;
            var content = ajaxHttp.responseText;
            if (content === '1') {//登录成功
                var followButton = $('yes');
                var followedButton = $('no');
                // followButton.style.display = 'none';
                // followedButton.style.display = 'inline';
                setCookie("loginSuc", "1");

            } else {
                alert("Login failed!");
            }
        }
    };
};

function checkLogin(){
    var loginSuc = getCookie("loginSuc");
    //没有读取到cookie的时候就会显示关注。读取到就显示已关注。
    if(!loginSuc){
        var loginForm = $('login');
        loginForm.style.display = 'block';
    }
}

function checkFollow(){
    var followSuc = getCookie("followSuc");
    var followButton = $('yes');
    var followedButton = $('no');
    if(!followSuc){
        followButton.style.display = 'inline';
        followedButton.style.display = 'none';
    }
    else{
        followButton.style.display = 'none';
        followedButton.style.display = 'inline';
    }
}

function follow(){
    checkLogin();
    var loginSuc = getCookie("loginSuc");
    if(loginSuc){
        var ajaxHttp = new XMLHttpRequest();
        var url = "http://study.163.com/webDev/attention.htm?";
        ajaxHttp.open("GET", url, true);
        ajaxHttp.send();
        ajaxHttp.onreadystatechange = function()
            {
                if (ajaxHttp.readyState==4 && ajaxHttp.status==200)
                {
                    //handle the response: ajaxHttp.responseText;
                    var content = ajaxHttp.responseText;
                    if (content === '1') {//登录成功
                        var followButton = $('yes');
                        var followedButton = $('no');
                        followButton.style.display = 'none';
                        followedButton.style.display = 'inline';
                        setCookie("followSuc", "1");

                    } else {
                        alert("Follow failed!");
                    }
                }
            };
    }
}

bind(cancelLoginButton, 'click', hideLoginForm);
bind(followButton, 'click', follow);
//bind(loginButton, 'click', login);
bind(loginButton, 'mousedown', loginButtonDown);
bind(loginButton, 'mouseup', loginButtonUp);
bind(loginButton, 'mouseout', loginButtonUp);
checkFollow();

// 轮播效果
var slider = function() {
    function $(id) {
        return document.getElementById(id);
    }
    //反正就是遍历函数。
    function each(arr, callback, thisp) {
        if (arr.forEach) {arr.forEach(callback, thisp);}
        else { for (var i = 0, len = arr.length; i < len; i++) callback.call(thisp, arr[i], i, arr);}
    }
    //图片淡入
    function fadeIn(elem) {
        elem.style.display="block";
         setOpacity(elem, 0);
         for ( var i = 0; i < 20; i++) {
            (function() {
                var pos = i * 5;
                setTimeout(function() {
                    setOpacity(elem, pos);
                }, i * 25);
            })(i);
         }
    }
    //图片隐藏
    function fadeOut(elem) {
        elem.style.display="none";
        setOpacity(elem, 0);
    }
    // 设置透明度
    function setOpacity(elem, level) {
        if (elem.filters) {
            elem.style.filter = "alpha(opacity=" + level + ")";
        } else {
            elem.style.opacity = level / 100;
        }
    }
    return {
        slide : function(imgWrapID, navsWrapID) {
            var INTERVAL = 5000;
            var self=this;
            var targetIndex=0;      //目标图片序号
            var currentIndex=0;       //现在图片序号
            var imgwrap = $(imgWrapID);
            this.imgs = imgwrap.getElementsByTagName("div");
            var navswrap = $(navsWrapID);
            this.navs = navswrap.children;
            var itvTimeElapsed = 0;
            var startTime = new Date();
            //初始化信息
            //将除了第一张外的所有图片设置为透明
            each(this.imgs, function(elem, idx, arr){
                if (idx !== 0) setOpacity(elem, 0);
            });

            //为所有的nav添加点击事件
            each(this.navs, function(elem, idx, arr){
                elem.onclick=function(){
                    //点击按钮的情况下，需要把两个计时器都清空，这样才不会造成冲突。
                    clearInterval(itv);
                    if (timeOut !== null) {
                        clearTimeout(timeOut);
                    }
                    //需要记录载入的时间
                    startTime = new Date();
                    //每次切换元素之后，都要重新计时
                    itvTimeElapsed = 0;
                    //点击之后就调用fade()函数切换图片和指示器
                    self.fade(idx, currentIndex);
                    currentIndex=idx;
                    targetIndex=idx;
                    //开启timer
                    itv=setInterval(step, INTERVAL);
                };
            });

            var step = function(){
                //每次step的时候，也需要记录开始的时间。
                startTime = new Date();
                //每次切换元素之后，都要重新计时
                itvTimeElapsed = 0;
                if(targetIndex<self.navs.length-1){
                    targetIndex++;
                }else{
                    targetIndex=0;
                }
                self.fade(targetIndex, currentIndex);
                currentIndex = targetIndex;
            };
            //自动轮播效果
            //本部分的思想是：用interval来控制轮播时间，同时用Date记录interval已经走过的时间，以此来计算剩下的时间。
            //!!!!!!!!!!!这一块时间处理比较麻烦，因为要涉及到计算悬停后剩余的时间，所以每次step的时候和每次鼠标点击之后，都要执行startTime=new Date();
            //!每次在鼠标出来之后和点击完按钮之后，都需要对设置的setTimeout进行清空，然后重新设置。
            var itv = setInterval(step, INTERVAL);
            var timeOut;
            $(imgWrapID).onmouseover=function(){
                //console.log("mouseon...");
                clearInterval(itv);
                //处理连续点击的情况，单次timer要取消掉才行！
                if (timeOut !== null) {
                    clearTimeout(timeOut);
                }
                var stopTime = new Date();

                timeElapsed = stopTime - startTime + itvTimeElapsed;
                //console.log("itvTimeElapsed:   " + itvTimeElapsed);
                if (timeElapsed >=0 && timeElapsed <= 5000) {
                    //正常情况下，直接记录即可。
                    itvTimeElapsed = timeElapsed;
                    //console.log("Normal......");
                } else if (timeElapsed < 0){
                    //这种情况代表已经翻页了，但是还没有操作，所以此时应该设置为过了5000，然后马上翻页。我也不知道为什么会这样。。。
                    itvTimeElapsed = 5000;
                    //console.log("<0....");
                } else {
                    itvTimeElapsed = 0;
                    //console.log(">5000....");
                }
            };
            $(imgWrapID).onmouseout=function(){
                startTime = new Date();
                if (timeOut !== null) {
                    clearTimeout(timeOut);
                }
                //console.log("Set to:" + (INTERVAL - itvTimeElapsed));
                //这个时候就应该设置从剩余时间INTERVAL - itvTimeElapsed毫秒之后开始timer。
                timeOut = setTimeout(function() {
                    recoverFromPause();
                }, INTERVAL - itvTimeElapsed);
            };

            //重启timer的时候需要手动执行一次step。
            var recoverFromPause = function() {
                step();
                clearInterval(itv);
                itv=setInterval(step, INTERVAL);
            };
        },

        //将上一张图片Opacity设置为0，当前这一张Opacity设置为1
        //并对小圆点进行处理
        fade:function(idx, lastIdx){
            if(idx == lastIdx) return;
            var self=this;
            fadeOut(self.imgs[lastIdx]);
            fadeIn(self.imgs[idx]);
            each(self.navs,function(elem,elemidx,arr){
                if (elemidx!=idx) {
                    self.navs[elemidx].style.backgroundColor = '#fff';
                }else{
                    self.navs[elemidx].style.backgroundColor = '#000';
                }
            });
        }
    };
}();


//热门排行
var hotcouresController = function() {

    function showHotcoures(hotcouresObjectList) {
        if (hotcouresObjectList !== null && hotcouresObjectList.length !== 0) {
            var hotcouresContainer = $('hotcoures');
            //var hotcouresItemList = document.getElementsByName('hotcouresItem');
            //alert(hotcouresItemList.length);
            for (var i = 0; i < 10; ++i) {
                //var hotcouresItem = hotcouresItemList[i];
                var hotcouresItem = createHotcouresElement(hotcouresObjectList[i]);
                hotcouresContainer.appendChild(hotcouresItem);
            }
        }
        //setTimeOut(showHotcoures, 5000);
    }

    function createHotcouresElement(couresData) {
        var hotcouresRootElem = document.createElement('div');
        hotcouresRootElem.className="onehot";

        //课程图片
        var hotcouresImgElem = document.createElement('img');
        hotcouresImgElem.className='img';
        hotcouresImgElem.src=couresData.smallPhotoUrl;

        var hotcouresContentElem = document.createElement('div');
        hotcouresContentElem.className='contents';
        //课程名称
        var hotcouresName = document.createElement('div');
        hotcouresName.className='words';
        hotcouresName.innerHTML = couresData.name;

        var hotcouresFans = document.createElement('div');
        hotcouresFans.className='fans';
        var hotcouresLearnerIcon = document.createElement('img');
        hotcouresLearnerIcon.src="img/user.png";

        //课程人数
        var hotcouresLearnerCount = document.createElement('span');
        hotcouresLearnerCount.innerHTML = couresData.learnerCount;
        hotcouresRootElem.appendChild(hotcouresImgElem);
        hotcouresRootElem.appendChild(hotcouresContentElem);
        hotcouresContentElem.appendChild(hotcouresName);
        hotcouresContentElem.appendChild(hotcouresFans);
        hotcouresFans.appendChild(hotcouresLearnerIcon);
        hotcouresFans.appendChild(hotcouresLearnerCount);

        return hotcouresRootElem;
    }

    function updateHotcouresDisplay(newCoures) {
        var hotcouresContainer = $('hotcoures');
        var firstCouresElem = hotcouresContainer.children[1];
        hotcouresContainer.removeChild(firstCouresElem);
        var newCouresElem = createHotcouresElement(newCoures);
        hotcouresContainer.appendChild(newCouresElem);
    }
    return {
        run : function() {
            var currentLastIndex = 9;
            var COURSE_COUNT = 20;
            var hotcouresObjectList = new Array([]);
            var hotcouresItemList = document.getElementsByName('hotcouresItem');
            var updateInterval;
            /*
            * 获取最热排行榜
             */
            function getHotcouresByCategory() {
                var ajaxHttp = new XMLHttpRequest();
                //处理URL
                var url = "http://study.163.com/webDev/hotcouresByCategory.htm";
                ajaxHttp.open("GET", url, true);
                ajaxHttp.send();
                ajaxHttp.onreadystatechange = function()
                {
                    if (ajaxHttp.readyState==4 && ajaxHttp.status==200)
                    {
                        var content = ajaxHttp.responseText;
                        hotcouresObjectList = eval(content);
                        showHotcoures(hotcouresObjectList);
                        updateInterval = setInterval(updateHotcoures, 5000);
                    }
                };
            }

            function updateHotcoures() {
                currentLastIndex++;
                currentLastIndex = currentLastIndex%COURSE_COUNT;
                updateHotcouresDisplay(hotcouresObjectList[currentLastIndex]);
            }
            getHotcouresByCategory();
         }
     };
    }();

window.onload=function(){
    slider.slide("imgwrap","navswrap");
    hotcouresController.run();
};

//左侧tab和课程
var couresController = function() {
    function updateCouresView(dataCount, dataList) {
        var couresWrapper = $('class');
        if (couresWrapper !== null && couresWrapper.childNodes.length !== 0) {
            var couresElemList = couresWrapper.children;
            for(i = couresElemList.length - 1; i >= 0; i--) {
                couresWrapper.removeChild(couresElemList[i]);
            }
        }
        for (var i = 0; i < dataList.length; i++) {
            var couresElem = createCuresItem(dataList[i]);
            couresWrapper.appendChild(couresElem);
        }
    }

    function createCuresItem(dataItem) {
        //根
        var couresDataItem = document.createElement('div');
        couresDataItem.className = "oneclass";
        //课程图片
        var couresImg = document.createElement('img');
        couresImg.className = "img";
        couresImg.src = dataItem.smallPhotoUrl;
        //标题
        var titleDiv = document.createElement('div');
        titleDiv.className = "title";
        titleDiv.id = "title";
        titleDiv.innerHTML = dataItem.name;
        //类别
        var typeDiv = document.createElement('div');
        typeDiv.className = "type";
        typeDiv.innerHTML = dataItem.provider + '';

        var learnerDiv = document.createElement('div');
        learnerDiv.className = "user";
        learnerDiv.innerHTML = '<img src="img/user.png">'+ dataItem.learnerCount +'</div>';

        var priceDiv = document.createElement('div');
        priceDiv.className = "price";
        priceDiv.innerHTML = "¥ " + dataItem.price +".00";

        var hoverDiv = document.createElement('div');
        hoverDiv.className = "hover";
        // hoverDiv.style.display = 'none';
        hoverDiv.id = "hover";

        var hoverUpDiv = document.createElement('div');
        hoverUpDiv.className = "up";
        var hoverCouresBigImg = document.createElement('img');
        hoverCouresBigImg.className = "bigimg";
        hoverCouresBigImg.src = dataItem.bigPhotoUrl;
        var hoverCouresInformation = document.createElement('div');
        hoverCouresInformation.style.display="inline-block";
        hoverCouresInformation.style.verticalAlign = "top";
        var hoverCouresTitle = document.createElement('div');
        hoverCouresTitle.className = 'hovertitle';
        hoverCouresTitle.innerHTML = dataItem.name;

        var hoverCouresLearner = document.createElement('div');
        hoverCouresLearner.className = "learn";
        hoverCouresLearner.innerHTML = '<img src="img/user.png"> ' + dataItem.learnerCount + '人在学';

        var hoverCouresProvider = document.createElement('div');
        hoverCouresProvider.className = "information";
        hoverCouresProvider.innerHTML = "发布者：" + dataItem.provider;

        var hoverCouresCategory = document.createElement('div');
        hoverCouresCategory.className = "information";
        hoverCouresCategory.innerHTML = "分类：" + dataItem.categoryName;

        var hoverDownDiv = document.createElement('div');
        hoverDownDiv.className = "down";
        var downInfoSpan = document.createElement('span');
        downInfoSpan.innerHTML = dataItem.description;

        hoverCouresInformation.appendChild(hoverCouresTitle);
        hoverCouresInformation.appendChild(hoverCouresLearner);
        hoverCouresInformation.appendChild(hoverCouresProvider);
        hoverCouresInformation.appendChild(hoverCouresCategory);

        hoverUpDiv.appendChild(hoverCouresBigImg);
        hoverUpDiv.appendChild(hoverCouresInformation);
        hoverDownDiv.appendChild(downInfoSpan);

        hoverDiv.appendChild(hoverUpDiv);
        hoverDiv.appendChild(hoverDownDiv);

        couresDataItem.appendChild(couresImg);
        couresDataItem.appendChild(titleDiv);
        couresDataItem.appendChild(typeDiv);
        couresDataItem.appendChild(learnerDiv);
        couresDataItem.appendChild(priceDiv);
        couresDataItem.appendChild(hoverDiv);
        //var
        return couresDataItem;
    }

    function updateIndexer(startIndex, currentPage) {
        console.log('startInde:' + startIndex + ',        currentPage:' + currentPage);
        var indexerWrapper = $('number');
        var indexerCount = indexerWrapper.children.length;
        for (var i = 0; i < indexerCount; i++) {
            var indexerSpanElem = indexerWrapper.children[i];
            // var indexerElem = indexerSpanElem.getElementsByTagName('li')[0];
            indexerSpanElem.innerHTML = startIndex + i;
            if (startIndex + i === currentPage) {
                indexerSpanElem.className = "chosen";
            } else {
                indexerSpanElem.className = "notchosen";
            }
        }
    }

    function createIndexer(startIndex, currentIndex, indexCount) {
        var indexerWrapper = $('number');
        if (indexerWrapper !== null && indexerWrapper.childNodes.length !== 0) {
            var previousIndexer = indexerWrapper.children;
            for(i = previousIndexer.length - 1; i >= 0; i--) {
                indexerWrapper.removeChild(previousIndexer[i]);
            }
        }
        if(startIndex<=currentIndex && indexCount <= 5){
            for(var i = 0; i < indexCount ; i++) {
                //alert(i);
                var indexLi = document.createElement('li');
                // var indexerA = document.createElement('a');
                if((startIndex + i) === currentIndex) {
                    indexLi.className = "chosen";
                } else {
                    indexLi.className = "notchosen";
                }
                indexLi.innerHTML = startIndex + i;
                // indexSpan.appendChild(indexerA);
                indexerWrapper.appendChild(indexLi);
            }
        }
    }

    return {
        run : function() {
            var totalCouresCount = 0; //总共的课程门数
            var currentPage = 1; //当前页码
            var totalPage = 0; //总共页码
            var startIndex = 1; //页表第一个页码
            var currentType = 10; //当前的课程类型
            var courseObject; //用来存储获取的数据
            var couresPerPage = 16; //每一页显示多少数据
            var couresCountOfCurrentPage; //当前页面一共多少个课程
            var couresListOfCurrentPage; //当前页面的课程数据列表
            var indexerCreated = false; //页表是否建立
            var lastRequestedPage = 0;

            function initVariables() {
                totalCouresCount = 0;
                currentPage = 1;
                totalPage = 0;
                startIndex = 1;
                currentType = 10;
                couresPerPage = 16;
                indexerCreated = false;
                lastRequestedPage = 0;
            }

            /*
            * 获取课程列表
             */
            function getCouresByCategory(pageNo, psize, type) {
                if (pageNo !== lastRequestedPage) {
                    var couresAjaxHttp = new XMLHttpRequest();
                    //处理URL
                    var url = "http://study.163.com/webDev/couresByCategory.htm?pageNo=" + pageNo +"&psize=" + psize + "&type=" + type;
                    couresAjaxHttp.open("GET", url, true);
                    couresAjaxHttp.send();
                    couresAjaxHttp.onreadystatechange = function()
                    {
                        if (couresAjaxHttp.readyState==4 && couresAjaxHttp.status==200)
                        {
                            //handle the response: couresAjaxHttp.responseText;
                            var content = couresAjaxHttp.responseText;
                            couresObject = eval('(' + content + ')');

                            totalCouresCount = couresObject.totalCount;
                            totalPage = couresObject.totalPage;
                            //currentPage = couresObject.pagination.pageIndex;
                            //
                            couresCountOfCurrentPage = couresObject.pagination.pageSize;
                            couresListOfCurrentPage = couresObject.list;

                            if (!indexerCreated) {
                                if(totalPage >= 5) {
                                    createIndexer(startIndex, currentPage, 5);
                                    indexerCreated = true;
                                } else {
                                    createIndexer(startIndex, currentPage, totalPage);
                                    indexerCreated = true;
                                }
                            } else {
                                updateIndexer(startIndex, currentPage);
                            }
                            updateCouresView(couresCountOfCurrentPage, couresListOfCurrentPage);
                        }
                    };
                    lastRequestedPage = pageNo;
                }
            }

            // 课程部分左上方的tab
            function tabChange(e){
                var target = getEventTag(e);
                if(target.id.toLowerCase() === 'design'){
                    $('design').className = "chosen";
                    $('laguage').className = 'notchosen';
                    if(currentType !== 10) {
                        initVariables();
                        indexerCreated = false;
                    }
                    currentType=10;
                    getCouresByCategory(currentPage, couresPerPage, currentType);
                    //alert(currentType);
                }else if(target.id.toLowerCase() === 'laguage'){
                    $('laguage').className = "chosen";
                    $('design').className = 'notchosen';
                    if(currentType !== 20) {
                        initVariables();
                        indexerCreated = false;
                    }
                    currentType=20;
                    getCouresByCategory(currentPage, couresPerPage, currentType);
                    //alert(currentType);
                }
            }

            bind($("tab"),"click",tabChange);

            // 分页器部分
            function pageChange(e){
                var target = getEventTag(e);
                if(target.tagName.toLowerCase() === 'li'){
                    // 组织时间冒泡
                    if(e.stopPropagation){
                        e.stopPropagation();
                    }else{
                        e.cancelBubble=true;
                    }
                    var number = $('number');
                    var a = number.getElementsByTagName('li');
                    for(var i = 0;i < a.length;i++){
                        a[i].className = 'notchosen';
                        if (a[i] === target) {
                            currentPage = startIndex + i;
                            //alert(currentPage);
                        }
                    }
                    //计算startpage
                    if(currentPage > 2 && totalPage >= 4){
                        if ((totalPage - currentPage) >= 2) {
                            startIndex = currentPage - 2;
                        } else {
                            startIndex = totalPage - 4;
                        }
                    } else if(currentPage <= 2) {
                        startIndex = 1;
                    }
                    updateIndexer(startIndex, currentPage);
                    getCouresByCategory(currentPage, couresPerPage, currentType);
                    //target.className = 'chosen';
                }
            }
            bind($('number'),'click',pageChange);

            

            function nextCouresPage(e) {
                var target = getEventTag(e);
                if(target.tagName.toLowerCase() === 'li'){
                    if(e.stopPropagation){
                        e.stopPropagation();
                    }else{
                        e.cancelBubble=true;
                    }
                    console.log('next');
                    if (currentPage < totalPage) {
                        currentPage++;
                    }
                    //计算startpage
                    if(currentPage > 2 && (totalPage - startIndex) > 4) {
                        startIndex = currentPage - 2;
                    }
                    updateIndexer(startIndex, currentPage);
                    getCouresByCategory(currentPage, couresPerPage, currentType);
                }
            }

            function priorCouresPage(e) {
                var target = getEventTag(e);
                if(target.tagName.toLowerCase() === 'li'){
                    if(e.stopPropagation){
                        e.stopPropagation();
                    }else{
                        e.cancelBubble=true;
                    }
                    console.log('prior');
                    if (currentPage > 1) {
                        currentPage --;
                    }
                    //计算startpage
                    if(currentPage > 2 && totalPage >= 4 && (totalPage - currentPage) >= 2) {
                        startIndex = currentPage - 2;
                    }
                    updateIndexer(startIndex, currentPage);
                    getCouresByCategory(currentPage, couresPerPage, currentType);
                }
            }

            bind($('couresPriorPage'), 'click', priorCouresPage);
            bind($('couresNextPage'), 'click', nextCouresPage);

            getCouresByCategory(currentPage, couresPerPage, currentType);
     }};
    }();
couresController.run();