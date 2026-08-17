<title>XGROK</title>
<meta name="description" content="XGROK是一款开源的内网穿透软件，旨在为普通用户提供简单快捷的网络穿透体验。">
<script>
    import '../styles/gh-fork-ribbon.min.css'
    let {data} = $props();
    const {oss} = data
    const repositoryUrl = 'https://github.com/meterXu/xgrok'
    const downloadItems = [
        {
            title: 'Windows版',
            value: 'windows'
        },
        {
            title: 'Mac版',
            value: 'macSelect'
        },
        {
            title: 'Docker版',
            value: 'docker'
        }
    ]

    function downloadFile(type,version) {
        const urls = {
            windows: {text: `xgrok-Setup-${version}.exe`, url: `${oss}/release/${version}/xgrok-Setup-${version}.exe`},
            mac: {text: `xgrok-${version}-arm64.dmg`, url: `${oss}/release/${version}/xgrok-${version}-arm64.dmg`},
            mac2: {text: `xgrok-${version}.dmg`, url: `${oss}/release/${version}/xgrok-${version}.dmg`}
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

    function typeSelect(type,version) {
        switch (type){
            case "windows":{
                return downloadFile(type,version)
            }
            case 'macSelect':{
                document.querySelector('.dialog').classList.add('show');
                document.querySelector('.dialog-content-1').classList.add('show');
            }break;
            case 'docker':{
                document.querySelector('.dialog').classList.add('show');
                document.querySelector('.dialog-content-2').classList.add('show');
            }break
        }
    }
    function hideDialog(){
        document.querySelector('.dialog').classList.remove('show')
        document.querySelector('.dialog-content-1').classList.remove('show');
        document.querySelector('.dialog-content-2').classList.remove('show');
    }
</script>
<div class="container-wrap">
    <div class="content">
        <a class="github-fork-ribbon" href="{repositoryUrl}" data-ribbon="Fork me on GitHub" title="Fork me on GitHub">Fork
            me on GitHub</a>
        <div class="header">
            <div class="logo-container">
                <div class="logo-icon"></div>
                <div class="logo-title">XGROK</div>
            </div>
        </div>
        <div class="title-container">
            <div class="title-1">简单/自由/安全</div>
            <div class="title-2">你的应用，访问<span class="important">无界限</span></div>
        </div>
        {#await data.version}
        {:then version}
            <ul class="download-ul">
                {#each downloadItems as item }
                    <li class="download_ul_li" onclick="{()=>typeSelect(item.value,version)}">
                        <div class="download-item-icon download-item-icon-{item.value}"></div>
                        <div class="download-item-label">{item.title}</div>
                    </li>
                {/each}
            </ul>
        {:catch error}
        {/await}
    </div>
</div>
<div class="footer-copyright">
    <div class="footer-content">
        <a href="https://beian.miit.gov.cn/#/Integrated/index">ICP备案号：苏ICP备20001603号-2</a>
        <a href="/document/termsOfService" target="_blank">服务条款</a>
        <a href="/document/privacyAgreement" target="_blank">隐私策略</a>
    </div>
</div>
<div class="dialog">
    <div class="dialog-modal" onclick="{hideDialog}"></div>
    <div class="dialog-content-1">
        <ul class="download-ul">
            <li class="download_ul_li" onclick="{()=>downloadFile('mac')}">
                <div class="download-item-icon download-item-icon-macSelect"></div>
                <div class="download-item-label">Mac Apple版</div>
            </li>
            <li class="download_ul_li" onclick="{()=>downloadFile('mac2')}">
                <div class="download-item-icon download-item-icon-macSelect"></div>
                <div class="download-item-label">Mac Intel版</div>
            </li>
        </ul>
    </div>
    <div class="dialog-content-2">
        <pre class="code">
            <code>
# create folder
mkdir -p /etc/xgrok/conf

# started by docker-compose
version: "3"
services:
  xgrok:
    image: meterxu/xgrok:latest
    container_name: xgrok
    ports:
      - 8181:8181
    volumes:
      - /etc/xgrok/conf:/xgrok/conf
    restart: always</code>
        </pre>
    </div>
</div>
