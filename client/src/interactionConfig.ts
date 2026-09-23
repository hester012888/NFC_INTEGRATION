export const INTERACTIONS: Record<string, { name: string; action: string; hint: string; index: number }> = {
    E01: { name: '视频观察', action: '观看视频后回答问题', hint: '先观看视频，再选出正确答案', index: 0 },
    E02: { name: '纹饰配对', action: '为服饰线索配成一对', hint: '观察材料、纹样与剪裁，连接对应描述', index: 1 },
    E03: { name: '纪念创作', action: '织一张专属纪念卡', hint: '选择纹样、留下署名，生成可保存的图片', index: 2 },
    E04: { name: '印章对位', action: '转正古印，落下一印', hint: '旋转印面，让上沿与定位标记对齐', index: 3 },
    E05: { name: '化石拂尘', action: '拂去尘土，发现骨架', hint: '用手指擦拭覆盖层，逐步揭开化石', index: 4 },
    E06: { name: '文句排序', action: '重排兰亭中的四句', hint: '依次放入句签，还原文句的先后顺序', index: 5 },
};

const FEATURES = [{
    title: '龙的主体',
    text: '以龙为主体，昂首蹲坐。',
    x: 37, y: 22
},
{
    title: '麒麟元素',
    text: '原页面资料将麒麟列为造型融合来源之一。',
    x: 57, y: 32
}, {
    title: '狮的神态', text: '从威猛的面部神态，寻找狮的造型联想。', x: 27, y: 47
}, { title: '犬的姿态', text: '观察蹲坐姿态，认识复合动物造型。', x: 65, y: 69 }];
