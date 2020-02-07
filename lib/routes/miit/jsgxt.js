const got = require('@/utils/got');
const cheerio = require('cheerio');

// module.exports = async (ctx) => {
//     const cid = ctx.params.cid;
//     const dict = {
//         tpxw: [6288, '图片新闻'],
//         gzdt: [6282, '工作动态'],
//         gggs: [6281, '公告公示'],
//         sjzc: [6278, '省级政策'],
//         gjzc: [6279, '国家政策'],
//         zcjd: [6197, '政策解读'],
//         zxgx: [6318, '最新更新'],
//     };
//     const link = `http://gxt.jiangsu.gov.cn/module/web/jpage/dataproxy.jsp?webid=23&columnid=${dict[cid][0]}&unitid=17546`;
//     const response = await got.get(link);
//     const $ = cheerio.load(response.data, {
//         xmlMode: true
//     });
//     const list = $('recordset').text().match('/<li.+<\/li>/g');

//     ctx.state.data = {
//         title: `${$('totalrecord').text()}`,
//         link,
//         item: list.map((item) => {
//                     item = cheerio.load(item);
//                     return {
//                         title: item.find('a').text(),
//                         // link: item.find('a').attr('.href'),
//                     };
//                 })
//     }
// }

module.exports = async (ctx) => {
    const id = ctx.params.id;
    const dict = {
        tpxw: [6288, 17546, '图片新闻'],
        gzdt: [6282, 17546, '工作动态'],
        gggs: [6281, 17546, '公告公示'],
        sjzc: [6278, 17739, '省级政策'],
        gjzc: [6279, 17739, '国家政策'],
        zcjd: [6197, 202056, '政策解读'],
        // zxgx: [6318, 17739, '最新更新'],
    };
    const link = `http://gxt.jiangsu.gov.cn/col/col${dict[id][0]}/index.html`;
    const response = await got.get(link);
    const $ = cheerio.load(response.data);
    const list = $(`#${dict[id][1]}`)
        .html()
        .match(/<li.+<\/li>/g);

    ctx.state.data = {
        title: `江苏省工信厅-${dict[id][2]}`,
        link,
        item: list.map((item) => {
            item = cheerio.load(item)('li');
            return {
                title: item.find('a').text(),
                link: `${item.find('a').attr('href')}`,
                pubDate: item
                    .contents()
                    .last()
                    .text(),
            };
        }),
    };
};
