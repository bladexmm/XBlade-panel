
function TextInput() {
    this.addOutput("text", "text");
    this.addProperty("text", "");
    this.widget = this.addWidget("text", "text", "", "text");  //link to property value
    this.widgets_up = true;
    this.size = [180, 30];
}

TextInput.title = "文本";
TextInput.desc = "文本";



function ImageInput() {
    this.addOutput("image", "image");
    this.addProperty("image", "");

    // 创建 HTML 元素用于上传图片
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.style.display = "none";
    document.body.appendChild(fileInput);

    // 创建用于显示图片的 img 元素
    const img = new Image();
    img.style.maxWidth = "100%"; // 设置最大宽度为父元素的宽度
    img.style.maxHeight = "100%"; // 设置最大高度为父元素的高度
    img.src = "";
    this.addWidget("image", "", null, img);
    const self = this;
    let imageValues = []; // 存储图片地址的数组
    this.size = [180, 400];

    // 当文件被选择时触发
    fileInput.onchange = function (e) {
        const file = e.target.files[0];
        const reader = new FileReader();

        reader.onload = function (event) {
            const src = event.target.result;
            img.src = src; // 读取图片后，更新图片的 src
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
                self.widgets[2].options.values = imageValues;
                self.setProperty('image', imageUrl);
            } else {
                throw new Error('File upload failed');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    };



    this.addWidget("button", "上传图片", null, function () {
        fileInput.click();
    });


    this.addWidget("button", "查看图片", null, function () {
        if(img.src != ''){
            window.open(img.src, '_blank');
        }
    });


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
                if (imageUrl != null) {
                    img.src = imageUrl
                    self.setProperty('image', imageUrl);
                }

            } else {
                throw new Error('File upload failed');
            }
        }).catch(error => {
            console.error('Error:', error);
        });
    });


    this.onPropertyChanged = function (name, value) {
        if (name === 'image' && value != null) {
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
        let iconHeight = this.size[0];
        if (iconHeight > this.size[1]) {
            iconHeight = this.size[1];
            iconWidth = this.size[1];
        }

        // 计算图标在节点内部的位置
        const x = (this.size[0] - iconWidth) / 2;
        const y = iconHeight;

        // 在节点内部绘制图标
        ctx.drawImage(img, 0, y, this.size[0], iconHeight);
    };

}

ImageInput.title = "图片";
ImageInput.desc = "上传图片";