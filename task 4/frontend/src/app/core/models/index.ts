export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  profileImage?: string;
  isBlocked?: boolean;
  createdAt?: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
}

export interface Tag {
  _id: string;
  name: string;
  slug: string;
}

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: Category | string;
  tags: Tag[] | string[];
  author: User | string;
  status?: string;
  isFeatured?: boolean;
  views?: number;
  likes?: string[];
  likeCount?: number;
  isLiked?: boolean;
  readingTime?: number;
  createdAt: string;
  updatedAt?: string;
  related?: Blog[];
  comments?: Comment[];
}

export interface Comment {
  _id: string;
  user: User | string;
  blogId: Blog | string;
  content: string;
  status: 'approved' | 'pending';
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  pagination?: Pagination;
  token?: string;
  user?: User;
}

export interface DashboardStats {
  totalBlogs: number;
  totalUsers: number;
  totalComments: number;
  pendingComments: number;
}
