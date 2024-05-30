function FindImage(){

    this.title = "查找图片";
    this.desc = "根据图片定位屏幕指定坐标";

    this.addProperty("searchTime", 5);
    this.addWidget("number","searchTime", 5, "searchTime");

    this.addProperty("confidence", 0.9);
    this.addWidget("slider","confidence", 0.9, "confidence", { min: 0, max: 1} );

    // 灰度匹配
	this.addProperty("grayscale", false);
    this.addWidget("toggle","grayscale", false,"grayscale", { on: "on", off:"off"} );


    this.addInput("cmd", "cmd");
    this.addInput("1", "image");
    this.addInput("2", "image");
    this.addInput("3", "image");
    this.addInput("4", "image");
    this.addInput("5", "image");
    this.addInput("6", "image");
    this.addInput("7", "image");
    this.addInput("8", "image");
    this.addInput("9", "image");

    this.addOutput("1", "cmd");
    this.addOutput("2", "cmd");
    this.addOutput("3", "cmd");
    this.addOutput("4", "cmd");
    this.addOutput("5", "cmd");
    this.addOutput("6", "cmd");
    this.addOutput("7", "cmd");
    this.addOutput("8", "cmd");
    this.addOutput("9", "cmd");
    this.addOutput("error", "cmd");

    this.size = [180, 210];
    this.widgets_up = true;
}



function LocateOnScreenNode() {
    this.addInput("cmd", "cmd");
    this.addInput("image", "image");
    this.addOutput("cmd", "cmd");
    this.addOutput("location", "location");
    this.addOutput("error", "cmd");

    // 创建 HTML 元素用于上传图片
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // 创建用于显示图片的 img 元素
    const img = new Image();
    img.style.maxWidth = "100%"; // 设置最大宽度为父元素的宽度
    img.style.objectFit = "contain";
    img.onload = function() {
        const aspectRatio = this.width / this.height;
        const parentWidth = this.parentElement.clientWidth;
        const parentHeight = this.parentElement.clientHeight;
        
        if (parentWidth / parentHeight > aspectRatio) {
            // 图像的高度将填满容器
            this.style.width = "auto";
            this.style.height = "100%";
        } else {
            // 图像的宽度将填满容器
            this.style.width = "100%";
            this.style.height = "auto";
        }
    };
    img.src = "";
    this.addWidget("image", "", null, img);

    const self = this;
    let aspectRatio = 1; // 图标的宽高比，默认为1
    let imageValues = []; // 存储图片地址的数组

    // 当文件被选择时触发
    fileInput.onchange = function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const src = event.target.result;
            img.src = src; // 读取图片后，更新图片的 src
            // 在图像加载完成后更新宽高比
            img.onload = function () {
                aspectRatio = img.width / img.height;
            };
        };

        reader.readAsDataURL(file);

        // 上传图片到服务器
        const formData = new FormData();
        formData.append('file', file);
        fetch('/api/upload/script', {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('File upload failed');
            }
        }).then(result => {
            if (result.code === 1) {
                const imageUrl = result.data;
                if (!imageValues.includes(imageUrl)) {
                    imageValues.push(imageUrl);
                    self.widgets[2].options.values = imageValues;
                    self.setProperty('image', imageUrl);
                }
            } else {
                throw new Error('File upload failed');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    };

    // this.addWidget("button", "Upload Image", null, function () {
    //     fileInput.click();
    // });

    this.addWidget("button", "粘贴图片", null, function () {
        fetch('/api/system/grabclipboard', {
            method: 'GET',
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('File upload failed');
            }
        }).then(result => {
            if (result.code === 1) {
                const imageUrl = result.data;
                if (!imageValues.includes(imageUrl) && imageUrl !== null) {
                    imageValues.push(imageUrl);
                    self.widgets[2].options.values = imageValues;
                    self.setProperty('image', imageUrl);
                }
            } else {
                throw new Error('File upload failed');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });


    this.addProperty("image", '');

    this.addProperty("searchTime", 5);
    this.addWidget("number","searchTime", 5, "searchTime");

    this.addProperty("confidence", 0.9);
    this.addWidget("slider","confidence", 0.9, "confidence", { min: 0, max: 1} );

    // 灰度匹配
	this.addProperty("grayscale", false);
    this.addWidget("toggle","grayscale", false,"grayscale", { on: "on", off:"off"} );
    this.size = [200, 380];
    this.onPropertyChanged = function (name, value) {
        if (name === 'image') {
            self.setProperty('image', value);
            img.src = value;
        }
    }
    // 在背景绘制方法中绘制图片
    this.onDrawBackground = function (ctx) {
        if (this.flags.collapsed)
            return;

        // 根据节点的大小和宽高比确定图标的宽度和高度
        let iconWidth = this.size[0];
        let iconHeight = this.size[0] / aspectRatio;
        if (iconHeight > this.size[1]) {
            iconHeight = this.size[1];
            iconWidth = this.size[1] * aspectRatio;
        }

        // 计算图标在节点内部的位置
        const x = (this.size[0] - iconWidth) / 2;
        const y = 200 + (this.size[1] - 200 - iconHeight) / 2;

        // 在节点内部绘制图标
        ctx.drawImage(img, x, y, iconWidth, iconHeight);
    };
}

LocateOnScreenNode.title = "图片定位";
LocateOnScreenNode.desc = "根据图片定位屏幕指定坐标";



function startApp(){
    this.addInput("cmd", "cmd");
    this.addOutput("cmd", "cmd");
    this.addProperty("app", '$path');
    this.addWidget("text","app", '$path', "app");
    this.addProperty("folder", '');
    this.addWidget("text","folder", '', "folder");
}

startApp.title = "启动应用";
startApp.desc = "启动应用，可用指定软件打开文件夹/文件";