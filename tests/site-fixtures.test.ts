import { afterEach, describe, expect, test } from "bun:test";
import { Window } from "happy-dom";
import { injectCheckboxColumn, removeCheckboxColumn } from "../src/components/CheckboxColumn";
import { openModal } from "../src/components/Modal";
import { selectionStore } from "../src/components/SelectionStore";
import { acgnxAdapter } from "../src/sites/acgnx";
import { acgripAdapter } from "../src/sites/acgrip";
import { anonekoAdapter } from "../src/sites/anoneko";
import { bangumiAdapter, clearMagnetCache, setMagnetCache } from "../src/sites/bangumi";
import { dmhyAdapter } from "../src/sites/dmhy";
import { kisssubAdapter } from "../src/sites/kisssub";
import { nyaaAdapter } from "../src/sites/nyaa";
import { shareacgnxAdapter } from "../src/sites/shareacgnx";
import { sukebeiAdapter } from "../src/sites/sukebei";
import type { SiteAdapter } from "../src/sites/types";

type TableFixture = {
  name: string;
  adapter: SiteAdapter;
  html: string;
  expectedTitle: string;
  expectedMagnet: string;
};

function mount(html: string, url = "https://example.test/"): void {
  const window = new Window({ url });
  window.SyntaxError = SyntaxError;
  globalThis.window = window as unknown as globalThis.Window & typeof globalThis;
  globalThis.document = window.document as unknown as Document;
  document.body.innerHTML = html;
}

function cloneAdapter(adapter: SiteAdapter): SiteAdapter {
  return { ...adapter };
}

afterEach(() => {
  selectionStore.deselectAll();
  clearMagnetCache();
  document.body.innerHTML = "";
});

const longMagnet = "magnet:?xt=urn:btih:0123456789abcdef0123456789abcdef01234567&dn=fixture";

const dmhyTable = `
  <table id="topic_list">
    <thead>
      <tr>
        <th>張貼日期</th>
        <th>分類</th>
        <th>標題</th>
        <th>磁鏈</th>
        <th>大小</th>
        <th>種子</th>
        <th>下載</th>
        <th>完成</th>
        <th>發佈人</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>今天 23:06<span style="display:none;">2026/05/12 23:06</span></td>
        <td><a class="sort-2" href="/topics/list/sort_id/2"><font color="red">動畫</font></a></td>
        <td><a href="/topics/view/123_fixture.html">DMHY Correct Title</a></td>
        <td><a class="download-arrow arrow-magnet" title="磁力下載" href="${longMagnet}">磁鏈</a></td>
        <td>522.3MB</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td><a href="/topics/list/user_id/1">fixture-user</a></td>
      </tr>
    </tbody>
  </table>
`;

const nyaaTable = `
  <table class="torrent-list">
    <thead>
      <tr>
        <th>Category</th>
        <th>Name</th>
        <th></th>
        <th>Link</th>
        <th>Size</th>
        <th>Date</th>
        <th></th>
        <th></th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><a href="/?c=1_2" title="Anime - English-translated"><img src="/static/img/icons/nyaa/1_2.png" alt="Anime - English-translated"></a></td>
        <td><a href="/view/1" title="Nyaa Correct Title">fallback</a><a class="comments" href="/view/1#comments">2</a></td>
        <td><a href="/download/1.torrent">torrent</a><a href="${longMagnet}">magnet</a></td>
        <td>1.6 GiB</td>
        <td>2026-05-12 23:33</td>
        <td>13</td>
        <td>26</td>
        <td>20</td>
      </tr>
    </tbody>
  </table>
`;

const acgnxTable = `
  <table id="listTable">
    <thead>
      <tr>
        <th>Date</th>
        <th>Category</th>
        <th>Name</th>
        <th>Size</th>
        <th>DL</th>
        <th>Condition</th>
        <th>Submitter/Union</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Tday 15:24</td>
        <td><a href="sort-2-1.html"><font color="red" title="Anime English Translated">A.E.T</font></a></td>
        <td><a href="/show-fixture.html" target="_blank">AcgnX Correct Title</a></td>
        <td>202.2MB</td>
        <td><a href="${longMagnet}"><img title="Magnet Download"></a></td>
        <td><img alt="0"></td>
        <td><a href="user-4-1.html">NyaaAnime</a></td>
      </tr>
    </tbody>
  </table>
`;

const shareAcgnxTable = `
  <table id="listTable">
    <thead>
      <tr>
        <th>發佈時間</th>
        <th>分類</th>
        <th>資源名稱</th>
        <th>大小</th>
        <th>磁鏈</th>
        <th>健康度</th>
        <th>發佈者/聯盟</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>今天 23:30</td>
        <td><a href="sort-1-1.html"><font color="red">動畫</font></a></td>
        <td><a href="/show-fixture.html" target="_blank">Share AcgnX Correct Title</a></td>
        <td>726.7MB</td>
        <td><a href="${longMagnet}"><img title="磁力下載"></a></td>
        <td><img alt="0"></td>
        <td><a href="user-529-1.html">TrySail</a></td>
      </tr>
    </tbody>
  </table>
`;

const acgripTable = `
  <table>
    <thead>
      <tr>
        <th class="hidden-xs hidden-sm">发布者</th>
        <th>标题</th>
        <th>DL</th>
        <th>大小</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>fixture-user</td>
        <td><a href="/t/353952">ACG.RIP Correct Title</a></td>
        <td class="action"><a href="/t/353952.torrent">download</a></td>
        <td>3.0GB</td>
      </tr>
    </tbody>
  </table>
`;

const kisssubTable = `
  <table id="listTable">
    <thead>
      <tr>
        <th>时间</th>
        <th>类别</th>
        <th>标题</th>
        <th>大小</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>2026-05-12</td>
        <td>动画</td>
        <td><a href="https://www.kisssub.org/show-abcdefabcdefabcdefabcdefabcdefabcdefabcd.html">KissSub Correct Title</a></td>
        <td>4.0GB</td>
      </tr>
    </tbody>
  </table>
`;

const tableFixtures: TableFixture[] = [
  { name: "dmhy", adapter: dmhyAdapter, html: dmhyTable, expectedTitle: "DMHY Correct Title", expectedMagnet: longMagnet },
  { name: "anoneko", adapter: anonekoAdapter, html: dmhyTable, expectedTitle: "DMHY Correct Title", expectedMagnet: longMagnet },
  { name: "nyaa", adapter: nyaaAdapter, html: nyaaTable, expectedTitle: "Nyaa Correct Title", expectedMagnet: longMagnet },
  { name: "sukebei", adapter: sukebeiAdapter, html: nyaaTable, expectedTitle: "Nyaa Correct Title", expectedMagnet: longMagnet },
  { name: "acgnx", adapter: acgnxAdapter, html: acgnxTable, expectedTitle: "AcgnX Correct Title", expectedMagnet: longMagnet },
  { name: "shareacgnx", adapter: shareacgnxAdapter, html: shareAcgnxTable, expectedTitle: "Share AcgnX Correct Title", expectedMagnet: longMagnet },
  { name: "acgrip", adapter: acgripAdapter, html: acgripTable, expectedTitle: "ACG.RIP Correct Title", expectedMagnet: "https://example.test/t/353952.torrent" },
  { name: "kisssub", adapter: kisssubAdapter, html: kisssubTable, expectedTitle: "KissSub Correct Title", expectedMagnet: "magnet:?xt=urn:btih:ABCDEFABCDEFABCDEFABCDEFABCDEFABCDEFABCD" },
];

describe("site adapter DOM fixtures", () => {
  test.each(tableFixtures)("$name extracts title and magnet after checkbox injection", ({ adapter, html, expectedTitle, expectedMagnet }: TableFixture) => {
    const subject = cloneAdapter(adapter);
    mount(html);

    injectCheckboxColumn(subject);

    const row = document.querySelector(subject.rowSelector);
    expect(row).not.toBeNull();
    expect(subject.extractTitle(row!)).toBe(expectedTitle);
    expect(subject.extractMagnet(row!)).toBe(expectedMagnet);
    expect(row!.querySelector(".amc-checkbox-col")).not.toBeNull();

    removeCheckboxColumn(subject);
  });

  test("bangumi extracts title and cached magnet after checkbox injection", () => {
    const subject = cloneAdapter(bangumiAdapter);
    mount(`
      <div class="torrent-list">
        <md-item class="torrent-row">
          <md-item-content>
            <a href="/torrent/bangumi-fixture-id">
              <div class="torrent-title"><h3>Bangumi Correct Title</h3></div>
            </a>
          </md-item-content>
        </md-item>
      </div>
    `);
    setMagnetCache("bangumi-fixture-id", longMagnet);

    injectCheckboxColumn(subject);

    const row = document.querySelector(subject.rowSelector);
    expect(row).not.toBeNull();
    expect(subject.extractTitle(row!)).toBe("Bangumi Correct Title");
    expect(subject.extractMagnet(row!)).toBe(longMagnet);
    expect(row!.querySelector(".amc-bangumi-cb")).not.toBeNull();

    removeCheckboxColumn(subject);
  });
});

describe("modal interactions", () => {
  test("pressing Escape closes the copy preview modal", async () => {
    const subject = cloneAdapter(dmhyAdapter);
    mount(dmhyTable, "https://share.dmhy.org/topics/list");

    injectCheckboxColumn(subject);
    selectionStore.selectAll([0]);

    await openModal();

    expect(document.querySelector(".amc-modal-overlay")).not.toBeNull();

    document.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));

    expect(document.querySelector(".amc-modal-overlay")).toBeNull();
  });
});
