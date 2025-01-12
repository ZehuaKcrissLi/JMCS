export const PRODUCTS = [
  { 
    id: 'xiaosuroufen', 
    name: '小酥肉粉', 
    dishes: ['zhaxiaosurou', 'suzhaouhe', 'jimihua']
  },
  { 
    id: 'kaorouliao', 
    name: '炸鸡裹粉', 
    dishes: ['zhajichi'] 
  },
] as const;

export const DISH_NAMES: Record<string, string> = {
  zhaxiaosurou: '炸小酥肉',
  suzhaouhe: '酥炸藕盒',
  jimihua: '鸡米花',
  zhajichi: '炸鸡翅'
};