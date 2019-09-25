import EXIF from 'exif-js'

import { Toast } from 'vant';

//找个出现最多的数
export const finMax = (str) => {
    let arr = str.split('')
    console.log(arr)
    let newarr = arr.reduce((per, cur) => {
        if (cur in per) {
            per[cur]++
        } else {
            per[cur] = 1
        }
        return per
    }, {})
}

// 模拟栈 
export function Stack() {
    //用数组模拟栈结构
    //栈结构 先进后出 first in last out
    this.stack = []
    //添加 
    Stack.prototype.add = function (el) {
        this.stack.push(el)
    }
    //删除
    Stack.prototype.del = function (el) {
        this.stack.pop(el)
    }
    //查看长度
    Stack.prototype.size = function () {
        return this.stack.length
    }
    //判断是否为空
    Stack.prototype.isEmpty = function () {
        if (this.stack.length > 0) {
            return true
        } else {
            return false
        }

    }
    //查看栈
    Stack.prototype.all = function () {
        return this.stack
    }
    //格式化字符串
    Stack.prototype.format = function () {

        return this.stack.join('')
    }

}
//二进制转换方法 1
export const changBinary = (num) => {
    let stack = new Stack()
    function xunHuan(num) {
        var nextNum = Math.floor(num / 2)
        if (num % 2 === 0) {
            if (nextNum < 1) {
                stack.add(1)
                return
            }
            xunHuan(nextNum)
            stack.add(0)
        } else {
            if (nextNum < 1) {
                stack.add(1)
                return
            }
            xunHuan(nextNum)
            stack.add(1)
        }

    }
    xunHuan(num)
    return stack.format()
}

//十进制转二进制 2
export const changBinary2 = (num) => {
    let stack2 = new Stack()
    function xunhuan(num) {
        var newNum = Math.floor(num / 2)
        if (num % 2 === 0) {
            if (newNum < 1) {
                stack2.add(1)
            }
            xunhuan(newNum)
            stack2.add(num % 2)
        } else {
            if (newNum < 1) {
                stack2.add(1)
            }
            xunhuan(newNum)
            stack2.add(num % 2)

        }
    }
    xunhuan(num)

}


//载入图片判断是否旋转
export const mySelectImage = fileObj => {
    var file = fileObj
    //图片方向角 added by lzk  
    var Orientation = null;

    if (file) {
        // console.log("正在上传,请稍后...");  
        var rFilter = /image\/\w+/; // 检查图片格式  
        if (!rFilter.test(file.type)) {
            Toast('请选择jpeg、png格式的图片')
            //showMyTips("请选择jpeg、png格式的图片", false);  
            return;
        }

        // var URL = URL || webkitURL;  
        //获取照片方向角属性，用户旋转控制  
        EXIF.getData(file, function () {
            EXIF.getAllTags(file);
            //alert(EXIF.getTag(this, 'Orientation'));   
            Orientation = EXIF.getTag(file, 'Orientation');
            Toast(Orientation)
            //return;  
        });

        var oReader = new FileReader();

        oReader.readAsDataURL(file);
        oReader.onload = function (e) {
            //var blob = URL.createObjectURL(file);  
            //_compress(blob, file, basePath);  
            var image = new Image();
            image.src = e.target.result;
            image.onload = function () {
                var expectWidth = this.naturalWidth;
                var expectHeight = this.naturalHeight;

                if (this.naturalWidth > this.naturalHeight && this.naturalWidth > 800) {
                    expectWidth = 800;
                    expectHeight = expectWidth * this.naturalHeight / this.naturalWidth;
                } else if (this.naturalHeight > this.naturalWidth && this.naturalHeight > 1200) {
                    expectHeight = 1200;
                    expectWidth = expectHeight * this.naturalWidth / this.naturalHeight;
                }
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                canvas.width = expectWidth;
                canvas.height = expectHeight;
                ctx.drawImage(this, 0, 0, expectWidth, expectHeight);
                var base64 = null;
                //修复ios  
                if (checkUA.isIOS()) {
                    // console.log('iphone');  
                    //alert(expectWidth + ',' + expectHeight);  
                    //如果方向角不为1，都需要进行旋转 added by lzk  
                    if (Orientation != "" && Orientation != 1) {
                        // alert('旋转处理');  
                        switch (Orientation) {
                            case 6://需要顺时针（向左）90度旋转  
                                Toast('需要顺时针（向左）90度旋转');
                                rotateImg(this, 'left', canvas);
                                break;
                            case 8://需要逆时针（向右）90度旋转  
                                Toast('需要顺时针（向右）90度旋转');
                                rotateImg(this, 'right', canvas);
                                break;
                            case 3://需要180度旋转  
                                Toast('需要180度旋转');
                                rotateImg(this, 'right', canvas);//转两次  
                                rotateImg(this, 'right', canvas);
                                break;
                        }
                    }

                    /*var mpImg = new MegaPixImage(image); 
                    mpImg.render(canvas, { 
                        maxWidth: 800, 
                        maxHeight: 1200, 
                        quality: 0.8, 
                        orientation: 8 
                    });*/
                    base64 = canvas.toDataURL("image/jpeg", 0.8);
                } else if (checkUA.isAndroid()) {// 修复android  
                    // var encoder = new JPEGEncoder();
                    // base64 = encoder.encode(ctx.getImageData(0, 0, expectWidth, expectHeight), 80);
                    base64 = canvas.toDataURL("image/jpeg", 0.8);
                    Toast('Android')
                } else {
                    Toast(Orientation);
                    if (Orientation != "" && Orientation != 1) {
                        //alert('旋转处理');  
                        switch (Orientation) {
                            case 6://需要顺时针（向左）90度旋转  
                                // alert('需要顺时针（向左）90度旋转');  
                                rotateImg(this, 'left', canvas);
                                break;
                            case 8://需要逆时针（向右）90度旋转  
                                // alert('需要顺时针（向右）90度旋转');  
                                rotateImg(this, 'right', canvas);
                                break;
                            case 3://需要180度旋转  
                                // alert('需要180度旋转');  
                                rotateImg(this, 'right', canvas);//转两次  
                                rotateImg(this, 'right', canvas);
                                break;
                        }
                    }

                    base64 = canvas.toDataURL("image/jpeg", 0.8);
                    Toast('其他设备')
                }
                //uploadImage(base64);  
                // $("#viewphoto").attr("src", base64);
                document.querySelector('#viewphoto').src = base64;
                // console.log("上传完成,请稍后..."); 
            };
        };

    }
}

//检测是否iso系统
const checkUA = {
    isIOS() {
        let u = navigator.userAgent;
        let isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端      
        return isiOS
    },
    isAndroid() {
        let u = navigator.userAgent;
        let isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        return isAndroid
    }

}

//对图片旋转处理 added by lzk  
const rotateImg = (img, direction, canvas) => {
    //alert(img);  
    //最小与最大旋转方向，图片旋转4次后回到原方向    
    var min_step = 0;
    var max_step = 3;
    //var img = document.getElementById(pid);    
    if (img == null) return;
    //img的高度和宽度不能在img元素隐藏后获取，否则会出错    
    var height = img.height;
    var width = img.width;
    //var step = img.getAttribute('step');    
    var step = 2;
    if (step == null) {
        step = min_step;
    }
    if (direction == 'right') {
        step++;
        //旋转到原位置，即超过最大值    
        step > max_step && (step = min_step);
    } else {
        step--;
        step < min_step && (step = max_step);
    }
    //img.setAttribute('step', step);    
    /*var canvas = document.getElementById('pic_' + pid);   
    if (canvas == null) {   
        img.style.display = 'none';   
        canvas = document.createElement('canvas');   
        canvas.setAttribute('id', 'pic_' + pid);   
        img.parentNode.appendChild(canvas);   
    }  */
    //旋转角度以弧度值为参数    
    var degree = step * 90 * Math.PI / 180;
    var ctx = canvas.getContext('2d');
    switch (step) {
        case 0:
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0);
            break;
        case 1:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, 0, -height);
            break;
        case 2:
            canvas.width = width;
            canvas.height = height;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, -height);
            break;
        case 3:
            canvas.width = height;
            canvas.height = width;
            ctx.rotate(degree);
            ctx.drawImage(img, -width, 0);
            break;
    }
} 