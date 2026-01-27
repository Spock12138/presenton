
export interface School {
  id: string;
  name: string;
  logo?: string;
}

export interface Template {
  id: string;
  schoolId: string;
  name: string;
  thumbnail: string;
  usage: string;
  major?: string;
  tags: string[];
  description: string;
}

export const SCHOOLS: School[] = [
  { id: 'zju', name: '浙江大学' },
  { id: 'pku', name: '北京大学' },
  { id: 'tsinghua', name: '清华大学' },
  { id: 'fudan', name: '复旦大学' },
  { id: 'sjtu', name: '上海交通大学' },
  { id: 'zjut', name: '浙江工业大学' },
  { id: 'hznu', name: '杭州师范大学' },
];

export const FILTERS = {
  majors: ['全部', '计算机系', '经济管理', '人文社科', '理工科', '艺术设计', '医学'],
  usages: ['全部', '开题报告', '期末汇报', '毕业答辩', '组会汇报', '学术讲座', '求职竞聘'],
};

export const MOCK_TEMPLATES: Template[] = [
  {
    id: 'zju-defense-blue',
    schoolId: 'zju',
    name: '浙大毕业答辩-求是蓝',
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&q=80',
    usage: '毕业答辩',
    major: '理工科',
    tags: ['严谨', '官方', '蓝色'],
    description: '适用于浙江大学理工科硕士/博士毕业答辩，包含校徽与标准配色。'
  },
  {
    id: 'zju-report-simple',
    schoolId: 'zju',
    name: '浙大期末汇报-简约风',
    thumbnail: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800&q=80',
    usage: '期末汇报',
    major: '计算机系',
    tags: ['简约', '现代'],
    description: '适用于课程期末展示，风格现代简约。'
  },
  {
    id: 'pku-red-classic',
    schoolId: 'pku',
    name: '北大经典红-学术报告',
    thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80',
    usage: '学术讲座',
    major: '人文社科',
    tags: ['经典', '红色', '庄重'],
    description: '北京大学标准红配色，适合正式学术场合。'
  },
  {
    id: 'zjut-blue-tech',
    schoolId: 'zjut',
    name: '浙工大科技蓝-开题报告',
    thumbnail: 'https://images.unsplash.com/photo-1557682224-5b8590cd14b1?w=800&q=80',
    usage: '开题报告',
    major: '理工科',
    tags: ['浙江工业大学', '计算机', '开题报告'],
    description: '浙江工业大学开题报告专用，强调逻辑与结构。'
  },
   {
    id: 'generic-defense',
    schoolId: 'all',
    name: '通用毕业答辩模板',
    thumbnail: 'https://images.unsplash.com/photo-1557682260-96773eb01377?w=800&q=80',
    usage: '毕业答辩',
    major: '全部',
    tags: ['通用', '简约'],
    description: '通用型毕业答辩模板，适用于大多数高校。'
  }
];
