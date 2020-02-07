const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const dict = {
        szfwj: '市政府文件',
    };
    const link = `http://www.cq.gov.cn/zwgk/${id}`;
    const response = await got.get(link);
    const $ = cheerio.load(response.data);
    const list = $('#city-fgwj-tem li');

    ctx.state.data = {
        title: `重庆人民政府-${dict[id]}`,
        link,
        item: list.map((item) => {
            item = $(item);
            return {
                title: item.find('a').text(),
                link: `http://www.cq.gov.cn${item.find('a').attr('href')}`,
                pubDate: item.find('i').text(),
            };
        }),
    };
};
