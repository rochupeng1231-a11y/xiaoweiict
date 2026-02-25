import bcrypt from 'bcrypt';
import { prisma } from '../config/database';
import { NotFoundError, ConflictError } from '../utils/errors';

/**
 * 根据用户名查找用户
 */
export const findUserByUsername = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
  });

  return user;
};

/**
 * 根据用户 ID 查找用户
 */
export const findUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      username: true,
      realName: true,
      role: true,
      department: true,
      phone: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new NotFoundError('User not found');
  }

  return user;
};

/**
 * 验证密码
 */
export const validatePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * 创建新用户
 */
export const createUser = async (userData: {
  username: string;
  password: string;
  realName: string;
  role?: string;
  department?: string;
  phone?: string;
  email?: string;
}) => {
  // 检查用户名是否已存在
  const existingUser = await findUserByUsername(userData.username);
  if (existingUser) {
    throw new ConflictError('Username already exists');
  }

  // 加密密码
  const passwordHash = await bcrypt.hash(userData.password, 10);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      username: userData.username,
      passwordHash,
      realName: userData.realName,
      role: userData.role || 'user',
      department: userData.department,
      phone: userData.phone,
      email: userData.email,
    },
    select: {
      id: true,
      username: true,
      realName: true,
      role: true,
      department: true,
      phone: true,
      email: true,
      status: true,
      createdAt: true,
    },
  });

  return user;
};

/**
 * 获取所有用户列表
 */
export const getAllUsers = async (params: { page?: number; limit?: number }) => {
  const page = params.page || 1;
  const limit = params.limit || 20;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      select: {
        id: true,
        username: true,
        realName: true,
        role: true,
        department: true,
        phone: true,
        email: true,
        status: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    }),
    prisma.user.count(),
  ]);

  return {
    data: users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

/**
 * 更新用户信息
 */
export const updateUser = async (
  userId: string,
  updates: {
    realName?: string;
    department?: string;
    phone?: string;
    email?: string;
    role?: string;
    status?: string;
  }
) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updates,
    select: {
      id: true,
      username: true,
      realName: true,
      role: true,
      department: true,
      phone: true,
      email: true,
      status: true,
      updatedAt: true,
    },
  });

  return user;
};

/**
 * 修改密码
 */
export const changePassword = async (userId: string, newPassword: string) => {
  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};

/**
 * 删除用户
 */
export const deleteUser = async (userId: string) => {
  await prisma.user.delete({
    where: { id: userId },
  });
};
