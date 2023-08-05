import Connector from '../engine/Connector.mjs';
import Manga from '../engine/Manga.mjs';
import HeaderGenerator from "../engine/HeaderGenerator.mjs";

export default class _se8us extends Connector {

    constructor() {
        super();
        super.id = 'se8us';
        super.label = '韩漫库';
        this.tags = ['hentai', 'chinese'];
        this.url = 'https://se8.us';
        this.requestOptions.headers.set("user-agent", 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36')
    }

    async _getMangaFromURI(uri) {
        const request = new Request(uri, this.requestOptions);
        const body = (await this.fetchDOM(request, 'body'))[0];
        const id = uri.pathname;
        const title = body.querySelector('.j-comic-title').textContent.trim();
        const author = body.querySelector('.comic-author .name').textContent.trim();
        const m = new Manga(this, id, `${title} [${author}]`);

        const chapters = []
        body.querySelectorAll('.chapter__list-box .j-chapter-link').forEach((element) => {
            chapters.push({
                id: this.getRootRelativeOrAbsoluteLink(element, this.url),
                title: element.text.trim(),
                language: ''
            })
        })
        m._chapters=chapters;
        return m
    }

    async _getChapters(manga) {
        return manga._chapters;
    }

    async _getPages(chapter) {
        const request = new Request(new URL(chapter.id, this.url), this.requestOptions);
        const data = await this.fetchDOM(request, 'div.rd-article-wr .rd-article__pic source');
        return data.map(img => this.createConnectorURI(img.getAttribute('data-original')));
    }

    // async _handleConnectorURI(payload) {
    //     const request = new Request(new URL(payload, this.url), this.requestOptions);
    //     const data = await this.fetchDOM(request, 'source#picarea');
    //     return super._handleConnectorURI(this.getAbsolutePath(data[0], request.url));
    // }
}