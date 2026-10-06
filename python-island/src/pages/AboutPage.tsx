import { LESSONS, REGIONS, TOTAL_XP, TOTAL_BADGES } from '../content';
import { Card } from '../ui/Frame';
import { actions, useProgress, xpOf, doneCount } from '../state/progress';

export function AboutPage({ go }: { go: (to: string) => void }) {
  const progress = useProgress();
  return (
    <div className="wrap">
      <div className="col">
        <h1 className="title">关于 Python 岛</h1>
        <div className="sub">一个给自己用的游戏化 Python 学习站</div>

        <Card title="这是什么">
          <div className="tip" style={{ lineHeight: 2 }}>
            学 Python 的地方。你在浏览器里写代码，它真的会跑 —— 靠 Pyodide 把 CPython 编译成
            WebAssembly，在本地执行。没有服务器，没有账号，进度存在你自己的浏览器里。
            <br /><br />
            内容规划成两季：<b style={{ color: '#fff' }}>第一季 40 关</b>打语法基础；
            <b style={{ color: '#fff' }}>第二季 44 关</b>带你做出能发给别人、打开就用的网页小工具。
          </div>
        </Card>

        <Card title="当前进度">
          <div className="kv"><span>关卡</span><b>{doneCount(progress)} / {LESSONS.length}</b></div>
          <div className="kv"><span>经验</span><b>{xpOf(progress)} / {TOTAL_XP}</b></div>
          <div className="kv"><span>徽章</span><b>{REGIONS.filter((r) => !r.comingSoon).length ? '见徽章墙' : '—'} / {TOTAL_BADGES}</b></div>
        </Card>

        <Card title="内容来源与合规">
          <div className="tip" style={{ lineHeight: 2 }}>
            知识点顺序参考《小白学 Python》（作者：水哥），原文以 <b style={{ color: '#fff' }}>CC BY 4.0</b> 许可发布：
            <br />
            <a href="https://github.com/walter201230/Python" target="_blank" rel="noreferrer">github.com/walter201230/Python</a>
            <br /><br />
            讲解正文与判分用例均为本项目原创。像素 UI 参考 NES.css 的设计语言；中文字体使用
            Fusion Pixel Font（MIT）；拉丁字体 Press Start 2P（OFL）。
            <br /><br />
            本项目为个人学习用途，不对外发布，不使用 Codédex 的课程内容、Logo 或角色美术。
          </div>
        </Card>

        <Card title="开发者自检">
          <div className="tip" style={{ marginBottom: 12 }}>
            判题引擎的回归测试台：8 个用例覆盖正常输出、语法错误、变量拼错、缩进错误、类型混用、
            死循环中断、input 输入、判分用例。
          </div>
          <button className="btn ghost sm" onClick={() => go('/engine')}>打开引擎自检 →</button>
        </Card>
      </div>

      <div className="side">
        <Card title="设置">
          <div className="kv">
            <span>音效</span>
            <b style={{ color: progress.settings.sound ? 'var(--green)' : 'var(--dim)' }}>
              {progress.settings.sound ? '开' : '关'}
            </b>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button className="btn ghost sm" onClick={() => actions.toggleSound()}>
              {progress.settings.sound ? '关掉音效' : '打开音效'}
            </button>
          </div>
        </Card>
        <Card title="危险操作">
          <div className="tip" style={{ marginBottom: 12 }}>清空所有关卡进度、XP 和卡片成色。不可撤销。</div>
          <button
            className="btn danger sm"
            onClick={() => { if (confirm('确定要清空全部进度吗？这个操作不能撤销。')) actions.resetAll(); }}
          >
            重置全部进度
          </button>
        </Card>
      </div>
    </div>
  );
}
