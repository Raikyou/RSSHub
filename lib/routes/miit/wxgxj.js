const got = require('@/utils/got');
const cheerio = require('cheerio');

module.exports = async (ctx) => {
    const id = ctx.params.id;

    if (id === `gzdt` || id === `gggs`) {
        // gzdt:工作动态, gggs:公告公示
        const link = `http://gxj.wuxi.gov.cn/zfxxgk/${id}/index.shtml`;
        const response = await got.get(link);
        const $ = cheerio.load(response.data);
        const list = $('.lh26 li');

        ctx.state.data = {
            title: `无锡市工信局-${$('.tit a')
                .eq(-1)
                .text()}`,
            link,
            item: list
                .map((index, item) => {
                    item = $(item);
                    return {
                        title: item.find('a').text(),
                        link: `http://gxj.wuxi.gov.cn${item.find('a').attr('.href')}`,
                        pubDate: item.find('span').text(),
                    };
                })
                .get(),
        };
    } else {
        const dict = {
            fgwj: [33, '法规文件'],
            ghjh: [39, '规划计划'],
        };
        const chanId = dict[id][0];
        const link = `http://gxj.wuxi.gov.cn/intertidwebapp/govChanInfo/getDocuments?siteId=1&ChannelType=2&KeyWord=&KeyWordType=&chanId=${chanId}`;
        const response = await got.post(link);
        const data = response.data.list;

        ctx.state.data = {
            title: `无锡市工信局-${dict[id][1]}`,
            link: `http://gxj.wuxi.gov.cn/zfxxgk/xxgkml/index.shtml`,
            item: data.map((item) => ({
                title: item.title,
                link: `http://gxj.wuxi.gov.cn${item.url}`,
                pubDate: item.openTime,
            })),
        };
    }
};
