export const PRODUCTS = [
  { 
    id: 'xiaosuroufen', 
    name: '小酥肉粉', 
    dishes: ['xiaosuroufan', 'xiangsujikuai', 'suxiaxia', 'zhayupai'] 
  },
  { 
    id: 'kaorouliao', 
    name: '烤肉料', 
    dishes: ['kaoyangrou', 'kaojichi', 'kaowuhua', 'kaoshengbei'] 
  },
] as const;

export const DISH_NAMES: Record<string, string> = {
  xiaosuroufan: '炸小酥肉',
  xiangsujikuai: '香酥鸡块',
  suxiaxia: '酥炸虾',
  zhayupai: '炸鱼排',
  kaoyangrou: '烤羊肉串',
  kaojichi: '烤鸡翅',
  kaowuhua: '烤五花肉',
  kaoshengbei: '烤生蚝'
};