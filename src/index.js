const template = document.createElement('template')

const getInnerHTML = () => {
  return `
  <style>
  .block-tip-dialog {
    position: fixed;
    top: 120px;
    right: 10em;
    width: 45em;
    height: 30em;
    display: none;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    font-size: 12px;
    background-color: #ffffff;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.618);
    animation: moveto 0.618s;
    -webkit-animation: moveto 0.618s;
    animation-timing-function: cubic-bezier(0, 0.13, 0.14, 1);
    padding: 1em;
    border-radius: 1em;
    z-index: 200000;
  }
  .block-tip-dialog .dlg-header {
    width: 100%;
    position: relative;
    text-align: center;
  }
  .block-tip-dialog .dlg-header .title {
    font-size: 2em;
    font-weight: 500;
  }
  .block-tip-dialog .dlg-header .warm-reminder {
    margin: 1rem 0;
  }
  .block-tip-dialog .dlg-header .btn-close {
    position: absolute;
    top: -3.6em;
    right: -3em;
    width: 4em;
    height: 4em;
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    margin: 0;
    border: 0;
    padding: 0;
    background-color: #ea552d;
    border-radius: 50%;
    cursor: pointer;
    transition: all 150ms;
  }
  .block-tip-dialog .dlg-header .btn-close .icon-cross {
      margin: 0;
      padding: 0;
      border: 0;
      background: none;
      position: relative;
      width: 26px;
      height: 26px;
  }
  .block-tip-dialog .dlg-header .btn-close .icon-cross:before, .block-tip-dialog .dlg-header .btn-close .icon-cross:after {
    content: '';
    position: absolute;
    top: 12.5px;
    left: 0;
    right: 0;
    height: 1px;
    background: #fff;
    border-radius: 1px;
  }
  .block-tip-dialog .dlg-header .btn-close .icon-cross:before {
    transform: rotate(45deg);
  }
  .block-tip-dialog .dlg-header .btn-close .icon-cross:after {
    transform: rotate(-45deg);
  }
  .block-tip-dialog .dlg-header .btn-close .icon-cross span {
    display: block;
  }
  .block-tip-dialog .dlg-header .btn-close:hover, .block-tip-dialog .dlg-header .btn-close:focus {
    transform: rotateZ(90deg);
    background-color: #fa0101;
  }
  .block-tip-dialog .pannel {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 20em;
  }
  .block-tip-dialog .pannel .item {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 20em;
    height: 100%;
  }
  .block-tip-dialog .pannel .item .qrcode {
    width: 16em;
    height: 16em;
  }
  .block-tip-dialog .pannel .item .text {
    font-size: 1.6em;
    color: #48576a;
  }
  @keyframes moveto {
    from {
      opacity: 0.618;
      right: -40em;
    }
    to {
      opacity: 1;
      right: 9em;
    }
  }
  </style>
 
  <div id="ad-block-remind" class="block-tip-dialog">
    <div class="dlg-header">
      <h2 class="title">
        若此弹框悬浮出来，多是由 AdBlock 触发
      </h2>
      <p class="warm-reminder">您可将本站加入白名单，解除广告屏蔽（ABP），感谢支持</p>
      <button id="close-btn" type="button" class="btn-close">
        <span class="icon-cross"></span>
      </button>
    </div>
    <div class="pannel">
      <div class="item">
        <img class="qrcode" src="https://nicelinks.site/static/img/reward_wexin.jpg" alt="微信打赏" />
        <strong class="text font-medium">“月黑见渔灯，</strong>
        <span class="text font-medium">微信打赏</span>
      </div>
      <div class="item">
        <img class="qrcode" src="https://nicelinks.site/static/img/reward_zhifubao.jpg" alt="倾城之链-小程序" />
        <strong class="text font-medium">孤光一点萤。”</strong>
        <span class="text font-medium">支付宝打赏</span>
      </div>
    </div>
  </div>
`
}

class AdBlockRemind extends HTMLElement {
  constructor() {
    super()

    template.innerHTML = getInnerHTML()
    this._shadowRoot = this.attachShadow({ mode: 'closed' })
    this._shadowRoot.appendChild(template.content.cloneNode(true))
    this.initEvents()
    setTimeout(() => {
      this.runAdsChecker()
    }, 200);
  }

  initEvents() {
    this._shadowRoot.querySelector('#close-btn').onclick = this.onCloseClick.bind(this)
    this.adBlockModal = this._shadowRoot.querySelector('#ad-block-remind')
  }

  runAdsChecker() {
    const elem = document.createElement('div')
    elem.className = 'adsbox google-ad'
    document.body.appendChild(elem)
    const isInstallAdBlock = 'none' === getComputedStyle(elem).display
    if (isInstallAdBlock) {
      this.adBlockModal.style.display = 'flex'
      this.sendGtagEventTracking('show')
    }
    document.body.removeChild(elem)
  }

  onCloseClick() {
    this.adBlockModal.style.display = 'none'
    this.sendGtagEventTracking('close')
  }

  sendGtagEventTracking(action) {
    const gtag = window.gtag || (() => {})
    gtag('event', action, {
        event_category: 'ad-fuck-block',
        event_label: 'ad-fuck-block',
    })
  }
}

window.customElements.define('ad-block-remind', AdBlockRemind)