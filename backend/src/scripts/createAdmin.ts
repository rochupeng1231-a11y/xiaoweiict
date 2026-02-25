import bcrypt from 'bcrypt';
import { prisma } from '../config/database';

async function createAdminUser() {
  try {
    // 检查是否已存在管理员用户
    const existingAdmin = await prisma.user.findUnique({
      where: { username: 'admin' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // 创建管理员用户
    const passwordHash = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.create({
      data: {
        username: 'admin',
        passwordHash,
        realName: '系统管理员',
        role: 'admin',
        status: 'active',
      },
    });

    console.log('Admin user created successfully:', {
      username: admin.username,
      realName: admin.realName,
      role: admin.role,
    });
    console.log('You can now login with:');
    console.log('  Username: admin');
    console.log('  Password: admin123');
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
