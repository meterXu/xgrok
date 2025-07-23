<title>xgrok-您的应用代理访问工具</title>
<link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/github-fork-ribbon-css/0.2.3/gh-fork-ribbon.min.css"/>
<script>
    let {data} = $props();
    let version = data.version
    function downloadFile(type) {
        const urls = {
            windows: {text: `xgrok-Setup-${version}.exe`, url: `./release/${version}/xgrok-Setup-${version}.exe`},
            mac: {text: `xgrok-${version}-arm64.dmg`, url: `./release/${version}/xgrok-${version}-arm64.dmg`},
            mac2: {text: `xgrok-${version}.dmg`, url: `./release/${version}/xgrok-${version}.dmg`}
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

    const repositoryUrl = 'https://github.com/meterXu/xgrok'
    const downloadItems = [
        {
            title: 'Windows版',
            value: 'windows'
        },
        {
            title: 'mac Apple版',
            value: 'mac'
        },
        {
            title: 'mac Intel版',
            value: 'mac2'
        }
    ]
</script>
<div class="container-wrap">
    <div class="content">
        <a class="github-fork-ribbon" href="{repositoryUrl}" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork
            me on GitHub</a>
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
            {#each downloadItems as item }
                <li class="download_ul_li" onclick="{downloadFile(item.value)}">
                    <div class="download-item-icon"></div>
                    <div class="download-item-label">{item.title}</div>
                </li>
            {/each}
        </ul>
    </div>
</div>
<div class="footer-copyright">
    <div class="footer-content">
        <a href="https://beian.miit.gov.cn/#/Integrated/index">ICP备案号：苏ICP备20001603号-2</a>
    </div>
</div>
