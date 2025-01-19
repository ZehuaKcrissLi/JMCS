export const PRODUCTS = [
  { 
    id: 'xiaosuroufen', 
    name: '小酥肉粉', 
    dishes: ['zhaxiaosurou', 'zhashucai', 'zhajilei_xsrf']
  },
  { 
    id: 'zhajiguofen', 
    name: '炸鸡裹粉', 
    dishes: ['zhajilei_zjgf'] 
  },
] as const;

export const DISH_NAMES: Record<string, string> = {
  zhaxiaosurou: '炸小酥肉',
  zhashucai: '炸蔬菜',
  zhajilei_xsrf: '炸鸡类',
  zhajilei_zjgf: '炸鸡类'
};
