<script>
        let version = '1.1.3'
        function downloadFile(type){
            const urls = {
                windows:{text:`xgrok-Setup-${version}.exe`,url:`./release/${version}/xgrok-Setup-${version}.exe`},
                mac:{text:`xgrok-${version}-arm64.dmg`,url:`./release/${version}/xgrok-${version}-arm64.dmg`},
                mac2:{text:`xgrok-${version}.dmg`,url:`./release/${version}/xgrok-${version}.dmg`}
            }
            // 创建一个a元素
            let a = document.createElement('a');
            // 设置文件的URL
            a.href = urls[type].url;
            // 设置下载的文件名
            a.download = urls[type].text;
            // 模拟点击
            document.body.appendChild(a);
            a.click();
            // 移除元素
            document.body.removeChild(a);
        }
</script>
<div class="container-wrap">
    <a class="github-fork-ribbon" href="https://github.com/meterXu/xgrok" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork me on GitHub</a>
    <div class="header">
        <div class="logo-container">
            <div class="logo-icon"></div>
            <div class="logo-title">xgrok</div>
        </div>
    </div>
    <div class="title-container">
        <div class="title-1">简单/自由/安全</div>
        <div class="title-2">你的应用，访问<span class="important">无界限</span></div>
    </div>
    <ul class="download-ul">
        <li class="download_ul_li" onclick="{downloadFile('windows')}">
            <div class="download-item-icon">
                
            </div>
            <div class="download-item-label">Windows版</div>
        </li>
        <li class="download_ul_li" onclick="{downloadFile('mac')}">
            <div class="download-item-icon">
                
            </div>
            <div class="download-item-label">mac Apple版</div>
        </li>
        <li class="download_ul_li" onclick="{downloadFile('mac2')}">
            <div class="download-item-icon">
                
            </div>
            <div class="download-item-label">mac Intel版</div>
        </li>
    </ul>
</div>
<div class="footer-copyright">
    <div class="con-container">
        <a href="https://beian.miit.gov.cn/#/Integrated/index">ICP备案号：苏ICP备20001603号-2</a>
    </div>
</div>