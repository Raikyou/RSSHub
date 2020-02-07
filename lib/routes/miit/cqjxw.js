const got = require('@/utils/got');

module.exports = async (ctx) => {
    const id = ctx.params.id;
    // const dict = {
    //     tzgg: '通知公告',
    //     jxwj: '政策文件',
    //     zcjd: '政策解读',
    // };
    const link = `http://jjxxw.cq.gov.cn/main/xxgk/xxgk-${id}/list.html`;
    const response = await got.get(link);
    const meta = response.data.match(/javascript:void\(0\);">(.*?)<\/a>/)[1];
    const data = JSON.parse(response.data.match(/tableData = ([\s\S]+);\s+var TOTAL_COUNT/)[1]);

    ctx.state.data = {
        title: `重庆经信委-${meta}`,
        link,
        item: data.map((item) => ({
            title: item.title,
            author: item.deptName,
            category: item.deptName,
            description: item.content,
            pubDate: new Date(item.releaseDate).toUTCString(),
            link: `http://jjxxw.cq.gov.cn/${item.href}`,
        })),
    };
};
