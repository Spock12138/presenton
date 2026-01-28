
export interface School {
  id: string;
  name: string;
  logo?: string;
}

export interface Template {
  id: string;
  schoolId: string;
  name: string;
  thumbnailUrl: string;
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
  { id: 'hdu', name: '杭州电子科技大学' },
  { id: 'zust', name: '浙江科技大学' },
  { id: 'hznu', name: '杭州师范大学' },
];

export const FILTERS = {
  majors: ['全部', '计算机系', '经济管理', '人文社科', '理工科', '艺术设计', '医学'],
  usages: ['全部', '开题报告', '期末汇报', '毕业答辩', '组会汇报', '学术讲座', '求职竞聘'],
};

// MOCK_TEMPLATES 已移除，现在通过 /api/templates/gallery 获取真实数据
