import { DesignModule } from '../types';

export const MODULES: DesignModule[] = [
  {
    id: 'AI-rendering',
    title: 'AI-rendering',
    description: 'Generate commercial renderings of urban environments or architectural designs.',
    imageUrl: '/modules/AIrendering.png',
    fixedPrompt: '保持参考图视角和图面结构不变，参考图二风格将图一生成为商业效果图',
    defaultUserPrompt: '广角鸟瞰视角，晴朗白天的自然光线，建筑表面为现代风格和玻璃材质，植被和水面细节丰富'
  },
  {
    id: 'Node-Scene',
    title: 'Node Scene Representation',
    description: 'Select points according to drawing, switch to view to selected point location, and maintain object consistency.',
    imageUrl: '/modules/nodescenerepresentation.jpg',
    fixedPrompt: '红色圈位置为摄像机位置，红色箭头方向为摄像头方向，根据这张图片生成摄像机位置人视点的效果图。',
    defaultUserPrompt: '图面比例16：9，分辨率2k,湖边加一些游玩的人，散步的情侣、野餐的家庭、遛狗的人、骑自行车的人等等，湖边小路上加上贩售亭、洗手池等公共设施。'
  },
  {
    id: 'Analysis Diagram',
    title: 'Analysis Diagram',
    description: 'Draw corresponding scene analysis diagram according to design requirements.',
    imageUrl: '/modules/analysisdiagram.jpg',
    fixedPrompt: '横向长图幅时间轴数据可视化，白色工程网格纸（Graph Paper）底纹。三段式排版：顶部大标题，中部核心拼贴画卷，底部线性时间轴与说明栏。专业的建筑拼贴画风格（Architecttural Collage）,混合媒介。整体采用低纯度、柔和的色调（Mured Tones），不鲜艳。左侧为暗淡的赭石色怀旧感，右侧为低饱和的现代冷赭石色科技感（）。画面中包含赭石色半透明圆形高光，以及贯穿建筑顶部的黑色虚线共形连接线。',
    defaultUserPrompt: '福州三坊七巷街区建筑风貌的历史演变全景，从左至右演变（分别对应图一到图三）左侧为明清时期传统福州建筑、古厝民居、马鞍形风火墙、青石板路、穿长袍马褂的清代文人；中间过渡为民国时期中西合璧建筑、老字号商铺、人力车、穿中山装的；右侧为现代修复后的三坊七巷，保存完好的传统建筑群、现代游客、文创店铺。'
  },
  {
    id: 'Exploded-view-diagram',
    title: 'Exploded view diagram',
    description: 'Focus on exploded view of building, analyzing its structure and space.',
    imageUrl: '/modules/explodedviewdiagram.jpg',
    fixedPrompt: '将这张图片生成建筑爆炸分析图，分析建筑立面、结构以及空间。',
    defaultUserPrompt: '高细节，包含结构分解（如"爆炸图"展示建筑分层/组件）、节点放大图（幕墙系统、结构节点、混凝土元素等）、尺寸标注、图例说明（区分结构钢、混凝土、玻璃、标注线等）。'
  },
  {
    id: 'Figure-ground-diagram',
    title: 'Figure-ground diagram',
    description: 'Draw figure-ground diagram according to design requirements.',
    imageUrl: '/modules/Figure-grounddiagram.jpg',
    fixedPrompt: '视图：正交轴测图（Orthographic axonometric），比例1:1000，俯视视角30°。配色：低饱和度色系（主色：#7BAFD4 蓝灰，#A8DADC 青绿，#F4A261 暖橙），柔和对撞色，避免高纯度色彩。线稿：黑色细线描边建筑轮廓，白色填充建筑体块，透明玻璃区域用浅蓝色渐变。纹理：纯色块填充功能分区（居住区=米黄，商业区=浅灰，绿地=青绿），叠加微噪点质感。',
    defaultUserPrompt: '1. 道路网络：主干道：4pt宽红色实线，次要道路：2pt宽橙色虚线;交通流线：白色箭头簇表示车流方向，密度按实际流量分级.功能分区：用半透明色块覆盖区域（透明度40%），图例标注"居住/商业/生态" 动态元素：人流热点：密集点群（直径0.5pt，#FF6B6B 红色）标注广场/地铁站.视线通廊：灰色半透明锥形区域连接景观节点.'
  },
  {
    id: 'Renovation-design',
    title: 'Renovation Design',
    description: 'For on-site and aerial photography, undertake modifications and designs based on existing conditions.',
    imageUrl: '/modules/renovationdesgin.jpg',
    fixedPrompt: '这是一项城市设计任务，根据这张用地地形图，规划设计一座现代城市滨河公共活力城，保留原有建筑，有慢行步道，亲水驳岸设计，丰富公共空间，路网清晰、低密度、体现科技自然与活力。成果图像维持视角不变。 ',
    defaultUserPrompt: '鸟瞰图，城市滨水区域，现代生态建筑（红砖、绿色屋顶、太阳能板、玻璃幕墙）+ 工业遗产（旧烟囱、废弃建筑），河流（船只、码头、木栈道），桥梁（钢结构、蓝色拱桥），绿地（公园、儿童游乐区、步道），行人活动，风力发电机，太阳能板，晴朗天空，高质量渲染，城市更新/生态规划效果图，细节丰富得色彩写实'
  }
];
