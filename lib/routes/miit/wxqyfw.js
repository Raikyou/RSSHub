const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const link = `http://www.wuxi.gov.cn/qyfw/fzlm/cs/${id}iframe/index.shtml`;
    const response = await got.get(link);
    const $ = cheerio.load(response.data);
    const list = $('.newsList a');
    const dict = {
        gj: '国家',
        jss: '江苏省',
        wxs: '无锡市',
    };

    ctx.state.data = {
        title: `无锡企业服务-政策速递-${dict[id]}`,
        link,
        item: list
            .map((index, item) => {
                item = $(item);
                return {
                    title: item.find('h3').text(),
                    link: `http://www.wuxi.gov.cn${item.attr('href')}`,
                    description: item.find('p').text(),
                    pubDate: item.find('span').text(),
                };
            })
            .get(),
    };
};
