import type { Exhibit } from "../types"

// 音频文件 - 中文版
import audioE01Zh from "../assets/audio/E01-zh.mp3"
import audioE02Zh from "../assets/audio/E02-zh.mp3"
import audioE03Zh from "../assets/audio/E03-zh.mp3"
import audioE04Zh from "../assets/audio/E04-zh.mp3"
import audioE05Zh from "../assets/audio/E05-zh.mp3"
import audioE06Zh from "../assets/audio/E06-zh.mp3"

// 音频文件 - 英文版（E01 已录）
import audioE01En from "../assets/audio/E01-en.mp3"

import imgE01 from "../assets/exhibits/E01.jpg"
import imgE02 from "../assets/exhibits/E02.jpg"
import imgE03 from "../assets/exhibits/E03.jpg"
import imgE04 from "../assets/exhibits/E04.jpg"
import imgE05 from "../assets/exhibits/E05.jpg"
import imgE06 from "../assets/exhibits/E06.jpg"

export const EXHIBITS: Exhibit[] = [
    {
        id: "E01",
        nfcTag: "NFC-E01",
        name: "金代铜坐龙",
        hall: "黑龙江历史文物馆",
        dynasty: "金·大定",
        category: "铜器",
        imageUrl: imgE01,
        stampColor: "#967039",
        stampSymbol: "龙",
        challenge: "金代铜坐龙的造型融合了哪些动物的特征？",
        challengeOptions: [
          "龙、麒麟、狮、犬",
          "龙、凤、虎、龟",
          "龙、马、牛、羊",
          "龙、蛇、鹰、鹿",
        ],
        challengeAnswer: 0,
        funFact:
          "铜坐龙出土于金上京会宁府遗址，集龙、麒麟、狮、犬特征于一身，是金代皇家御用器物，也是黑龙江省博物馆的镇馆之宝之一。",
        description:
          "此铜坐龙为黑龙江省博物馆镇馆之宝，出土于金上京会宁府遗址（今黑龙江省阿城区），是迄今发现的金代最精美的铜铸龙形器物之一。",
        detail:
          "铜坐龙通体呈蹲坐姿态，四爪有力，昂首挺胸，口衔宝珠，尾部上卷。造型集龙头、麒麟角、狮鼻、犬齿于一身，刚健威猛而又灵动飘逸。全身以细密鱼鳞纹装饰，铸工精湛，线条流畅。铜坐龙出土时置于宫殿基址，应为金代皇宫御用陈设器。其独特的造型风格既融合了中原汉族龙的传统意象，又体现了女真族粗犷豪放的审美趣味，是研究金代宫廷文化与铸铜工艺的重要实物。",
        material: "铜铸，表面鎏金痕迹",
        dimensions: "高 24.5 cm · 重约 2.4 kg",
        audioLength: "3:48",
        audioSrc: {
          zh: audioE01Zh,
          en: audioE01En,
          // yue: audioE01Yue,
          // ja: audioE01Ja,
        },
      },
      {
        id: "E02",
        nfcTag: "NFC-E02",
        name: "金代齐国王墓丝织品服饰",
        hall: "黑龙江历史文物馆",
        dynasty: "金·大定",
        category: "丝织品",
        imageUrl: imgE02,
        stampColor: "#a3563c",
        stampSymbol: "织",
        challenge:
          "金代齐国王墓出土的丝织品服饰，主要反映了当时哪一阶层的服饰制度？",
        challengeOptions: ["平民百姓", "皇室贵族", "僧侣阶层", "商贾富户"],
        challengeAnswer: 1,
        funFact:
          "金代齐国王墓被誉为「塞北马王堆」，出土丝织品服饰种类繁多、保存完好，是研究金代服饰制度与纺织工艺的珍贵实物。",
        description:
          "金代齐国王墓出土的系列丝织品服饰，被誉为「塞北马王堆」，为研究金代贵族服饰制度与纺织技艺提供了最直观的实物依据。",
        detail:
          "齐国王墓位于黑龙江省阿城区，墓主为金代宗室贵族。墓中出土丝织品种类繁多，包括袍服、裙裤、靴帽及各类织物残片，总数逾百件，保存状态极为罕见。织物涵盖绫、罗、绸、锦、绢、纱等多种品类，纹样有团花、宝相花、凤穿花等，织工精细，色彩历经数百年仍较为鲜艳。服饰剪裁兼具汉制圆领袍与女真传统对襟特征，是民族文化交融的生动体现。这批服饰填补了金代纺织史研究的重要空白，对了解宋金时期北方纺织技艺与贵族礼仪制度具有极高价值。",
        material: "蚕丝织物（绫、罗、锦等）",
        dimensions: "袍服通长约 140 cm(代表件)",
        audioLength: "4:15",
        audioSrc: {
          zh: audioE02Zh,
          // en: audioE02En,
          // yue: audioE02Yue,
          // ja: audioE02Ja,
        },
      },
      {
        id: "E03",
        nfcTag: "NFC-E03",
        name: "南宋《蚕织图》卷轴",
        hall: "书画艺术馆",
        dynasty: "南宋",
        category: "书画",
        imageUrl: imgE03,
        stampColor: "#937347",
        stampSymbol: "蚕",
        challenge: "《蚕织图》描绘的主要内容是？",
        challengeOptions: ["宫廷宴乐", "蚕桑与丝织生产", "山水风光", "佛教经变"],
        challengeAnswer: 1,
        funFact:
          "《蚕织图》以长卷形式细致描绘了从浴蚕、养蚕到织帛的全过程，是研究南宋蚕桑丝织技术与民俗生活的珍贵图像资料。",
        description:
          "南宋《蚕织图》以横卷形式系统描绘蚕桑丝织的完整工序，画面细腻写实，是现存最珍贵的农业生产题材绘画之一。",
        detail:
          "《蚕织图》全卷共分二十四段，从清明浴蚕开始，历经眠蚕、上簇、缫丝、络丝、经丝、织帛等主要工序，直至成匹布帛，完整再现了江南地区蚕桑生产的全貌。画中人物神态生动，器具描绘精准，建筑与庭院布局真实可信，为宋代民间生产生活提供了珍贵的图像档案。画面用笔工整细腻，设色淡雅清丽，兼具历史文献与艺术审美的双重价值。配以文字榜题，图文并茂，具有极强的科普教化功能。此件为南宋摹本，原作者相传为楼俦，摹本忠实保留了原作风貌。",
        material: "绢本设色",
        dimensions: "纵 27.5 cm · 横 513 cm(全卷)",
        audioLength: "5:02",
        audioSrc: {
          zh: audioE03Zh,
          // en: audioE03En,
          // yue: audioE03Yue,
          // ja: audioE03Ja,
        },
      },
      {
        id: "E04",
        nfcTag: "NFC-E04",
        name: "唐代渤海天门军之印",
        hall: "黑龙江历史文物馆",
        dynasty: "唐·渤海国",
        category: "印章",
        imageUrl: imgE04,
        stampColor: "#855934",
        stampSymbol: "印",
        challenge: "「天门军之印」中的「天门军」最可能是指？",
        challengeOptions: [
          "渤海国的一支军队",
          "唐代宫廷禁军",
          "地方行政机构",
          "民间武装",
        ],
        challengeAnswer: 0,
        funFact:
          "天门军之印出土于渤海国上京龙泉府遗址，是渤海国仿唐官制的实物证据，说明渤海国在军政制度上深受唐朝影响。",
        description:
          "「渤海天门军之印」出土于渤海国上京龙泉府遗址（今黑龙江省宁安市），是目前出土渤海印章中铭文最为清晰完整的珍品之一。",
        detail:
          "此铜印呈正方形,鼻钮,印面阴刻「天门军之印」五字,字体方正规整,为典型唐代官印风格。渤海国(698—926年)是我国东北地区以靺鞨族为主体建立的地方民族政权，极盛时辖五京十五府，文化高度发达，史称「海东盛国」。渤海国政治制度仿效唐朝，设三省六部，军队亦仿唐制分军设印。天门军为渤海国军队番号之一，此印即为该部军队的官方凭信，用于公文往来与军事调度。印文布局严谨，刀法刚劲，既体现了渤海国对中原文明的吸收与学习，也折射出唐代东北亚政治格局的历史面貌。",
        material: "青铜铸造",
        dimensions: "印面 6.2 * 6.2 cm · 通高 4.8 cm",
        audioLength: "3:30",
        audioSrc: {
          zh: audioE04Zh,
          // en: audioE04En,
          // yue: audioE04Yue,
          // ja: audioE04Ja,
        },
      },
      {
        id: "E05",
        nfcTag: "NFC-E05",
        name: "披毛犀化石骨架",
        hall: "古生物馆",
        dynasty: "更新世",
        category: "化石",
        imageUrl: imgE05,
        stampColor: "#81705b",
        stampSymbol: "犀",
        challenge: "披毛犀属于哪一类动物？",
        challengeOptions: ["食肉动物", "大型植食性哺乳动物", "鸟类", "爬行动物"],
        challengeAnswer: 1,
        funFact:
          "披毛犀是更新世冰期代表性动物，全身披长毛以适应寒冷气候，化石在东北地区多有发现。",
        description:
          "披毛犀(Coelodonta antiquitatis)是更新世冰期最具代表性的大型哺乳动物之一，全身被覆浓密长毛，与猛犸象同为冰河时代的标志性生物。",
        detail:
          "披毛犀体型巨大,肩高可达1.8米,体长约4米,鼻部具有两支角,前角长而侧扁,可达1米以上,主要用于刨雪觅食。全身覆有厚实的双层皮毛,外层为粗硬长毛,内层为细密绒毛,是对严酷冰期气候的高度适应。披毛犀广泛分布于欧亚大陆北部,在我国东北地区的黑龙江、内蒙古等地均有化石出土,大约在距今约1万年前灭绝,可能与气候变暖及人类猎杀有关。黑龙江省博物馆馆藏的披毛犀化石骨架出土于省内河床沉积层，骨骼保存较为完整，是东北地区古生物研究的重要实物资料。",
        material: "骨骼化石（羟磷灰石矿化）",
        dimensions: "骨架全长约 3.8 m · 肩高约 1.7 m",
        audioLength: "4:55",
        audioSrc: {
          zh: audioE05Zh,
          // en: audioE05En,
          // yue: audioE05Yue,
          // ja: audioE05Ja,
        },
      },
      {
        id: "E06",
        nfcTag: "NFC-E06",
        name: "南宋《兰亭序》图卷",
        hall: "书画艺术馆",
        dynasty: "南宋",
        category: "书画",
        imageUrl: imgE06,
        stampColor: "#9c814f",
        stampSymbol: "书",
        challenge: "《兰亭序》原是东晋王羲之在什么场合写下的？",
        challengeOptions: ["宫廷宴饮", "兰亭修禊雅集", "出征饯行", "佛寺讲经"],
        challengeAnswer: 1,
        funFact:
          "《兰亭序》被誉为「天下第一行书」，南宋摹本图卷虽非真迹，却保留了王羲之书风与兰亭雅集的历史场景，是研究书法与文人文化的重要资料。",
        description:
          "南宋《兰亭序》图卷将王羲之经典名帖与兰亭雅集图景融为一体，书画相映，文史互证，是宋代文人雅趣与书法崇拜的集中体现。",
        detail:
          "《兰亭序》原作由东晋书圣王羲之于永和九年(353年)三月三日,在绍兴兰亭修禊宴集时乘兴挥毫而就,全文324字,凡字有重复者皆别出新意，被历代书家奉为行书极则，誉为「天下第一行书」。唐太宗得其真迹后奉若至宝，相传以之殉葬，后世流传者皆为摹本。南宋此图卷将书法摹本与描绘兰亭雅集场景的绘画合为一卷，画中文人曲水流觞，松竹掩映，文雅闲适之气扑面而来。书法部分笔势飘逸，结字精妙，虽为摹本，仍可感受王羲之的神采风韵。此卷对于研究宋代书法传承脉络与文人审美观念具有重要意义。",
        material: "纸本墨笔（书）、绢本设色（图）",
        dimensions: "纵 26.8 cm · 横 386 cm(全卷)",
        audioLength: "5:20",
        audioSrc: {
          zh: audioE06Zh,
          // en: audioE06En,
          // yue: audioE06Yue,
          // ja: audioE06Ja,
        },
      },
]