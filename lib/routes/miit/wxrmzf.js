const got = require('@/utils/got');

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const dict = {
        swwj: [34665, '市委文件'],
        szfwj: [172, '市政府文件'],
        swbgs: [34666, '市委办公室'],
        szfbgs: [173, '市政府办公室'],
        zcjd: [175, '政策解读'],
        xdcyzc: [51889, '现代产业政策'],
    };
    const link = `http://www.wuxi.gov.cn/intertidwebapp/govChanInfo/getDocuments?pageIndex=1&pageSize=20&siteId=2&ChannelType=1&KeyWord=&KeyWordType=&chanId=${dict[id][0]}`;
    const response = await got.post(link);
    const data = response.data.list;

    ctx.state.data = {
        title: `无锡人民政府-${dict[id][1]}`,
        link,
        item: data.map((item) => ({
            title: item.title,
            link: `http://www.wuxi.gov.cn${item.url}`,
            pubDate: item.openTime,
        })),
    };
};
