import { GridCell, CommandType, LevelConfig } from './types';

export const GRID_SIZE = 4;

// Helper to get varied encouragement messages
export const getRandomEncouragement = (): string => {
  const messages = [
    "太棒了！你真聪明！",
    "挑战成功！继续加油！",
    "哇，你学得真快！",
    "做得好！小机器人为你点赞！",
    "真厉害！下一关等着你！",
    "完美的表现！",
    "你真是个编程小天才！",
    "好样儿的！完全正确！",
    "真不错！逻辑很清晰！"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

// Helper to get milestone messages for every 5th level
export const getMilestoneMessage = (levelId: number): string | null => {
  if (levelId % 5 !== 0) return null;

  switch (levelId) {
    case 5: return "你已经玩到第五关了，太棒了！";
    case 10: return "你成功到达第十关，越来越厉害了！";
    case 15: return "第十五关挑战成功，你真聪明！";
    case 20: return "哇，二十关都难不倒你，继续加油！";
    case 25: return "二十五关达成！你是编程小能手！";
    case 30: return "三十关了！你的逻辑越来越清晰了！";
    case 35: return "三十五关！小机器人为你感到骄傲！";
    case 40: return "四十关达成！离终极目标不远了！";
    case 45: return "四十五关！坚持就是胜利！";
    case 50: return "五十关全部通关！你是最棒的编程大师！";
    default: return `恭喜你通过了第${levelId}关！真棒！`;
  }
};

// Level Definitions - 50 Levels for Kindergarten
export const LEVELS: LevelConfig[] = [
  // --- 阶段一：初识前后 (1-4) ---
  {
    id: 1,
    title: "第1关：出发！",
    description: "小狗就在前面，向前走一步！",
    start: { x: 1, y: 2, direction: 90 },
    target: { x: 2, y: 2, item: '🐶' },
    items: [
      { x: 0, y: 0, item: '🌳' },
      { x: 3, y: 0, item: '🌳' },
    ]
  },
  {
    id: 2,
    title: "第2关：多走几步",
    description: "小猫离得有点远，向前走两步。",
    start: { x: 0, y: 2, direction: 90 },
    target: { x: 2, y: 2, item: '🐱' },
    items: [
      { x: 1, y: 0, item: '🏠' },
    ]
  },
  {
    id: 3,
    title: "第3关：向下走",
    description: "这次我们要向下走，找到蘑菇。",
    start: { x: 2, y: 0, direction: 180 },
    target: { x: 2, y: 2, item: '🍄' },
    items: [
      { x: 0, y: 1, item: '🌳' },
    ]
  },
  {
    id: 4,
    title: "第4关：倒车请注意",
    description: "前面是墙壁，试着后退一步！",
    start: { x: 1, y: 1, direction: 90 },
    target: { x: 0, y: 1, item: '🚩' },
    items: [
      { x: 2, y: 1, item: '🧱', isObstacle: true },
    ]
  },

  // --- 阶段二：学会转弯 (5-9) ---
  {
    id: 5,
    title: "第5关：向左转",
    description: "香蕉在左边。先左转，再前进！",
    start: { x: 2, y: 2, direction: 0 },
    target: { x: 1, y: 2, item: '🍌' },
    items: [
      { x: 2, y: 1, item: '🧱', isObstacle: true },
    ]
  },
  {
    id: 6,
    title: "第6关：向右转",
    description: "胡萝卜在右边。先右转，再前进！",
    start: { x: 1, y: 2, direction: 0 },
    target: { x: 2, y: 2, item: '🥕' },
    items: [
      { x: 1, y: 1, item: '🧱', isObstacle: true },
    ]
  },
  {
    id: 7,
    title: "第7关：简单的弯道",
    description: "先向前走，再向左转。",
    start: { x: 2, y: 3, direction: 0 },
    target: { x: 1, y: 2, item: '🎈' },
    items: []
  },
  {
    id: 8,
    title: "第8关：另一边的弯道",
    description: "先向前走，再向右转。",
    start: { x: 1, y: 3, direction: 0 },
    target: { x: 2, y: 2, item: '🎁' },
    items: []
  },
  {
    id: 9,
    title: "第9关：回头看",
    description: "目标在身后！转两个弯就能掉头啦。(右转两次)",
    start: { x: 1, y: 2, direction: 90 },
    target: { x: 0, y: 2, item: '🔙' },
    items: []
  },

  // --- 阶段三：简单的重复 (10-14) ---
  {
    id: 10,
    title: "第10关：星星奖励",
    description: "路上有一颗星星！试着走到星星那里再到终点！",
    start: { x: 0, y: 2, direction: 90 },
    target: { x: 3, y: 2, item: '🏆' },
    items: [
      { x: 1, y: 2, isStar: true }, // STAR!
      { x: 0, y: 3, item: '🌲' }
    ]
  },
  {
    id: 11,
    title: "第11关：竖直冲刺",
    description: "这次是向下的长跑！",
    start: { x: 3, y: 0, direction: 180 },
    target: { x: 3, y: 3, item: '🏁' },
    items: []
  },
  {
    id: 12,
    title: "第12关：倒车入库",
    description: "我们要退很远哦！小心别碰到路障。",
    start: { x: 3, y: 1, direction: 270 },
    target: { x: 3, y: 3, item: '🅿️' },
    items: [
        { x: 2, y: 1, item: '🚫', isObstacle: true }
    ]
  },
  {
    id: 13,
    title: "第13关：走楼梯",
    description: "一步一步来，像下楼梯一样。(前进，左转，前进)",
    start: { x: 2, y: 2, direction: 0 },
    target: { x: 1, y: 1, item: '🪜' },
    items: []
  },
  {
    id: 14,
    title: "第14关：双星闪耀",
    description: "哇！有两颗星星！你能全部收集吗？",
    start: { x: 0, y: 3, direction: 90 },
    target: { x: 3, y: 1, item: '🏁' },
    items: [
        { x: 1, y: 3, isStar: true },
        { x: 2, y: 1, isStar: true },
        { x: 1, y: 1, item: '🧱', isObstacle: true }
    ]
  },

  // --- 阶段四：小小探险家 (15-20) ---
  {
    id: 15,
    title: "第15关：绕过石头",
    description: "前面有石头挡路，我们要绕过去。",
    start: { x: 1, y: 3, direction: 0 },
    target: { x: 1, y: 1, item: '💎' },
    items: [
      { x: 1, y: 2, item: '🪨', isObstacle: true },
    ]
  },
  {
    id: 16,
    title: "第16关：魔法传送门",
    description: "走进蓝色的漩涡试试看！",
    start: { x: 0, y: 1, direction: 90 },
    target: { x: 3, y: 1, item: '🔑' },
    items: [
      { x: 1, y: 1, portalColor: 'blue' }, // Portal In
      { x: 2, y: 1, portalColor: 'blue' }, // Portal Out
      { x: 1, y: 2, item: '🌲'}
    ]
  },
  {
    id: 17,
    title: "第17关：穿越障碍",
    description: "墙壁挡住了路？用红色的传送门穿过去！",
    start: { x: 0, y: 2, direction: 90 },
    target: { x: 3, y: 2, item: '📫' },
    items: [
        { x: 2, y: 2, item: '🧱', isObstacle: true },
        { x: 1, y: 2, portalColor: 'red' }, // Changed from orange to red
        { x: 3, y: 1, portalColor: 'red' }  // Portal exit at (3,1) above target (3,2)
    ]
  },
  {
    id: 18,
    title: "第18关：对角线",
    description: "终点在最远的角落，怎么走最近？",
    start: { x: 0, y: 3, direction: 90 },
    target: { x: 3, y: 0, item: '🏁' },
    items: [
        { x: 1, y: 3, isStar: true }
    ]
  },
  {
    id: 19,
    title: "第19关：迷宫入口",
    description: "别碰到墙壁！",
    start: { x: 0, y: 2, direction: 90 },
    target: { x: 2, y: 1, item: '🏰' },
    items: [
        { x: 1, y: 2, item: '🧱', isObstacle: true },
        { x: 1, y: 1, item: '🧱', isObstacle: true },
    ]
  },
  {
    id: 20,
    title: "第20关：大冒险",
    description: "自由发挥吧！收集所有星星！",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 3, y: 3, item: '🎉' },
    items: [
        { x: 1, y: 1, isStar: true },
        { x: 2, y: 2, isStar: true },
        { x: 0, y: 3, portalColor: 'purple' },
        { x: 3, y: 0, portalColor: 'purple' }
    ]
  },

  // --- 阶段五：循环训练营 (21-30) ---
  {
    id: 21,
    title: "第21关：循环的魔力",
    description: "要走3步！试试【循环开始】+【前进】+【循环结束】+【3次】。",
    start: { x: 0, y: 2, direction: 90 },
    target: { x: 3, y: 2, item: '🍓' },
    items: []
  },
  {
    id: 22,
    title: "第22关：传送循环",
    description: "传送门也可以用循环吗？",
    start: { x: 0, y: 1, direction: 90 },
    target: { x: 3, y: 3, item: '🔙' },
    items: [
        { x: 2, y: 1, portalColor: 'blue' },
        { x: 0, y: 3, portalColor: 'blue' }
    ]
  },
  {
    id: 23,
    title: "第23关：向上爬",
    description: "向上冲刺！记得用循环哦。",
    start: { x: 2, y: 3, direction: 0 },
    target: { x: 2, y: 0, item: '🚀' },
    items: [
      { x: 1, y: 3, item: '☁️' }, { x: 3, y: 3, item: '☁️' }
    ]
  },
  {
    id: 24,
    title: "第24关：一步两步",
    description: "这次只要重复2次前进。",
    start: { x: 0, y: 0, direction: 180 },
    target: { x: 0, y: 2, item: '👣' },
    items: []
  },
  {
    id: 25,
    title: "第25关：左转练习",
    description: "前进，左转，前进。小心障碍物。",
    start: { x: 2, y: 3, direction: 0 },
    target: { x: 0, y: 3, item: '📫' },
    items: [{ x: 2, y: 1, item: '🧱', isObstacle: true}]
  },
  {
    id: 26,
    title: "第26关：简单的阶梯",
    description: "前进2步，右转，前进2步。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 2, y: 2, item: '🎁' },
    items: []
  },
  {
    id: 27,
    title: "第27关：跳格子",
    description: "前进，前进。重复这个动作！",
    start: { x: 0, y: 1, direction: 90 },
    target: { x: 3, y: 1, item: '🐸' },
    items: []
  },
  {
    id: 28,
    title: "第28关：巡逻路线",
    description: "走到头，再走回来。",
    start: { x: 0, y: 2, direction: 90 },
    target: { x: 0, y: 2, item: '👮' },
    items: []
  },
  {
    id: 29,
    title: "第29关：方块舞",
    description: "前进，右转。重复4次会发生什么？",
    start: { x: 1, y: 1, direction: 0 },
    target: { x: 1, y: 1, item: '💃' },
    items: []
  },
  {
    id: 30,
    title: "第30关：长距离后退",
    description: "后退，后退，后退！",
    start: { x: 3, y: 3, direction: 0 },
    target: { x: 3, y: 0, item: '🦐' },
    items: []
  },

  // --- 阶段六：规律大师 (31-40) ---
  {
    id: 31,
    title: "第31关：上楼梯",
    description: "前进，右转，前进，左转。这是一个台阶。",
    start: { x: 0, y: 2, direction: 0 },
    target: { x: 2, y: 0, item: '🪜' },
    items: [
        { x: 0, y: 0, item: '🚫', isObstacle: true },
        { x: 1, y: 2, item: '🚫', isObstacle: true }
    ]
  },
  {
    id: 32,
    title: "第32关：下楼梯",
    description: "试试反过来的阶梯。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 2, y: 2, item: '↘️' },
    items: [
        { x: 2, y: 0, item: '🚫', isObstacle: true },
        { x: 0, y: 2, item: '🚫', isObstacle: true }
    ]
  },
  {
    id: 33,
    title: "第33关：直走太无聊",
    description: "这里不能走直线，必须绕弯。",
    start: { x: 0, y: 0, direction: 180 },
    target: { x: 0, y: 3, item: '🏁' },
    items: [
        { x: 1, y: 3, item: '🧱', isObstacle: true },
        { x: 2, y: 2, item: '🧱', isObstacle: true }
    ]
  },
  {
    id: 34,
    title: "第34关：四个角落",
    description: "你能走到对角线吗？",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 3, y: 3, item: '📍' },
    items: []
  },
  {
    id: 35,
    title: "第35关：大回环",
    description: "绕着地图边缘走一圈！",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 0, y: 1, item: '🏁' },
    items: [
        { x: 1, y: 1, item: '🏠' }, { x: 2, y: 1, item: '🏠' },
        { x: 1, y: 2, item: '🏠' }, { x: 2, y: 2, item: '🏠' }
    ]
  },
  {
    id: 36,
    title: "第36关：穿梭",
    description: "前进2步，右转，前进2步。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 2, y: 2, item: '🚀' },
    items: []
  },
  {
    id: 37,
    title: "第37关：躲避障碍",
    description: "利用循环快速通过走廊。",
    start: { x: 0, y: 1, direction: 90 },
    target: { x: 3, y: 1, item: '🚪' },
    items: [
        { x: 0, y: 0, item: '🧱', isObstacle: true }, { x: 1, y: 0, item: '🧱', isObstacle: true }, { x: 2, y: 0, item: '🧱', isObstacle: true }, { x: 3, y: 0, item: '🧱', isObstacle: true },
        { x: 0, y: 2, item: '🧱', isObstacle: true }, { x: 1, y: 2, item: '🧱', isObstacle: true }, { x: 2, y: 2, item: '🧱', isObstacle: true }, { x: 3, y: 2, item: '🧱', isObstacle: true },
    ]
  },
  {
    id: 38,
    title: "第38关：Z字抖动",
    description: "前进，后退，前进，后退...好像在跳舞！",
    start: { x: 1, y: 2, direction: 90 },
    target: { x: 3, y: 2, item: '🕺' },
    items: []
  },
  {
    id: 39,
    title: "第39关：回形针弯道",
    description: "走到底，掉头，再走一半。",
    start: { x: 0, y: 1, direction: 90 },
    target: { x: 2, y: 2, item: '📎' },
    items: []
  },
  {
    id: 40,
    title: "第40关：对角折返",
    description: "前进，左转，前进，右转。",
    start: { x: 1, y: 3, direction: 0 },
    target: { x: 2, y: 1, item: '↗️' },
    items: []
  },

  // --- 阶段七：终极挑战 (41-50) ---
  {
    id: 41,
    title: "第41关：迷宫逃脱 I",
    description: "只有一条路是对的。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 3, y: 3, item: '🏆' },
    items: [
        { x: 1, y: 0, item: '🧱', isObstacle: true },
        { x: 1, y: 1, item: '🧱', isObstacle: true },
        { x: 3, y: 2, item: '🧱', isObstacle: true },
    ]
  },
  {
    id: 42,
    title: "第42关：迷宫逃脱 II",
    description: "小心死胡同！",
    start: { x: 0, y: 3, direction: 0 },
    target: { x: 3, y: 0, item: '🌟' },
    items: [
        { x: 0, y: 1, item: '🧱', isObstacle: true },
        { x: 2, y: 3, item: '🧱', isObstacle: true },
        { x: 2, y: 2, item: '🧱', isObstacle: true },
    ]
  },
  {
    id: 43,
    title: "第43关：贪吃蛇",
    description: "像贪吃蛇一样填满地图。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 3, y: 2, item: '🐍' },
    items: []
  },
  {
    id: 44,
    title: "第44关：可以循环吗？",
    description: "当然可以！观察重复的动作。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 2, y: 2, item: '❓' },
    items: []
  },
  {
    id: 45,
    title: "第45关：漫长的旅程",
    description: "这是最远的一关。",
    start: { x: 0, y: 0, direction: 180 },
    target: { x: 0, y: 1, item: '🏠' },
    items: [
         { x: 1, y: 1, item: '🌊', isObstacle: true }, { x: 2, y: 1, item: '🌊', isObstacle: true },
         { x: 1, y: 2, item: '🌊', isObstacle: true }, { x: 2, y: 2, item: '🌊', isObstacle: true }
    ]
  },
  {
    id: 46,
    title: "第46关：精准定位",
    description: "走到中间去。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 1, y: 1, item: '🎯' },
    items: []
  },
  {
    id: 47,
    title: "第47关：四角巡逻",
    description: "要把四个角落都走一遍。",
    start: { x: 0, y: 0, direction: 90 },
    target: { x: 0, y: 1, item: '🏁' },
    items: [
        { x: 3, y: 0, item: '🚩' },
        { x: 3, y: 3, item: '🚩' },
        { x: 0, y: 3, item: '🚩' }
    ]
  },
  {
    id: 48,
    title: "第48关：障碍赛跑",
    description: "不要碰到红色的障碍物。",
    start: { x: 1, y: 3, direction: 0 },
    target: { x: 2, y: 0, item: '🏆' },
    items: [
        { x: 0, y: 2, item: '🚫', isObstacle: true },
        // Fixed: Removed obstacle at (2,2) to allow passage
        { x: 1, y: 1, item: '🚫', isObstacle: true },
        { x: 3, y: 1, item: '🚫', isObstacle: true }
    ]
  },
  {
    id: 49,
    title: "第49关：收集星星",
    description: "拿到所有星星才能过关。",
    start: { x: 1, y: 1, direction: 0 },
    target: { x: 2, y: 2, item: '🌟' },
    items: [
        { x: 0, y: 0, isStar: true },
        { x: 3, y: 0, isStar: true },
        { x: 0, y: 3, isStar: true },
        { x: 3, y: 3, isStar: true }
    ]
  },
  {
    id: 50,
    title: "第50关：毕业典礼",
    description: "你真棒！去领奖杯吧！",
    start: { x: 2, y: 3, direction: 0 },
    target: { x: 1, y: 0, item: '🎓' },
    items: [
        { x: 0, y: 0, item: '🎉' }, { x: 3, y: 0, item: '🎉' },
        { x: 0, y: 1, item: '🎈' }, { x: 3, y: 1, item: '🎈' },
        { x: 1, y: 2, isStar: true }, { x: 2, y: 2, isStar: true }
    ]
  }
];

// Helper to get item at a specific position for rendering
export const getItemAt = (level: LevelConfig, x: number, y: number) => {
  // Check if target
  if (level.target.x === x && level.target.y === y) {
    return { ...level.target, isTarget: true };
  }
  
  // Check items
  return level.items.find(i => i.x === x && i.y === y);
};