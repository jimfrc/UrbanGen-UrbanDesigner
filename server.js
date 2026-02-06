import express from 'express';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import crypto from 'crypto';
import { AlipaySdk, AlipayFormData } from 'alipay-sdk';
import alipayConfig from './alipay.config.js';

const app = express();
const PORT = 3002;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

const IMAGES_DIR = path.join(process.cwd(), 'generated-images');
const DATABASE_DIR = path.join(process.cwd(), 'database');
const GENERATION_RECORDS_FILE = path.join(DATABASE_DIR, 'generation-records.json');
const USERS_FILE = path.join(DATABASE_DIR, 'users.json');
const ORDERS_FILE = path.join(DATABASE_DIR, 'orders.json');

const alipaySdk = new AlipaySdk(alipayConfig);

if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

const hashPassword = (password) => {
  return crypto.createHash('sha256').update(password + 'urban_gen_salt').digest('hex');
};

const loadGenerationRecords = () => {
  try {
    if (fs.existsSync(GENERATION_RECORDS_FILE)) {
      const data = fs.readFileSync(GENERATION_RECORDS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return { records: [] };
  } catch (error) {
    console.error('Error loading generation records:', error);
    return { records: [] };
  }
};

const saveGenerationRecords = (data) => {
  try {
    fs.writeFileSync(GENERATION_RECORDS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving generation records:', error);
  }
};

const loadUsers = () => {
  try {
    if (fs.existsSync(USERS_FILE)) {
      const data = fs.readFileSync(USERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return { users: [] };
  } catch (error) {
    console.error('Error loading users:', error);
    return { users: [] };
  }
};

const saveUsers = (data) => {
  try {
    fs.writeFileSync(USERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
};

const loadOrders = () => {
  try {
    if (fs.existsSync(ORDERS_FILE)) {
      const data = fs.readFileSync(ORDERS_FILE, 'utf-8');
      return JSON.parse(data);
    }
    return { orders: [] };
  } catch (error) {
    console.error('Error loading orders:', error);
    return { orders: [] };
  }
};

const saveOrders = (data) => {
  try {
    fs.writeFileSync(ORDERS_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving orders:', error);
  }
};

app.post('/api/save-image', (req, res) => {
  try {
    const { imageData, imageId } = req.body;

    if (!imageData || !imageId) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    console.log('Received image data length:', imageData.length);
    console.log('Image data prefix:', imageData.substring(0, 100));

    let base64Data;
    if (imageData.startsWith('data:image/')) {
      const match = imageData.match(/^data:image\/([a-zA-Z+]+);base64,(.+)$/);
      if (match) {
        base64Data = match[2];
        console.log('Extracted base64 data length:', base64Data.length);
      } else {
        base64Data = imageData.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
        console.log('Fallback extracted base64 data length:', base64Data.length);
      }
    } else {
      base64Data = imageData;
      console.log('No data URL prefix found, using raw data');
    }

    const buffer = Buffer.from(base64Data, 'base64');
    console.log('Buffer size:', buffer.length);

    const fileName = `${imageId}.png`;
    const filePath = path.join(IMAGES_DIR, fileName);

    fs.writeFileSync(filePath, buffer);

    res.json({ 
      success: true, 
      localPath: filePath 
    });
  } catch (error) {
    console.error('Error saving image:', error);
    res.status(500).json({ error: 'Failed to save image' });
  }
});

app.post('/api/save-generation-record', (req, res) => {
  try {
    const { userId, userName, userEmail, imageId, model, resolution, aspectRatio, imageSize, prompt, userPrompt, moduleName, credits, success } = req.body;

    if (!userId || !imageId || !model) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const db = loadGenerationRecords();
    
    const record = {
      id: Date.now().toString(),
      userId,
      userName: userName || '',
      userEmail: userEmail || '',
      imageId,
      model,
      resolution: resolution || '',
      aspectRatio: aspectRatio || '',
      imageSize: imageSize || '',
      prompt: prompt || '',
      userPrompt: userPrompt || '',
      moduleName: moduleName || '',
      credits: credits || 0,
      success: success !== false,
      timestamp: Date.now(),
      createdAt: new Date().toISOString()
    };

    db.records.push(record);
    saveGenerationRecords(db);

    res.json({ 
      success: true, 
      recordId: record.id 
    });
  } catch (error) {
    console.error('Error saving generation record:', error);
    res.status(500).json({ error: 'Failed to save generation record' });
  }
});

app.get('/api/generation-records', (req, res) => {
  try {
    const { userId } = req.query;
    const db = loadGenerationRecords();
    
    let records = db.records;
    
    if (userId) {
      records = records.filter(record => record.userId === userId);
    }

    res.json({ 
      success: true, 
      records: records.sort((a, b) => b.timestamp - a.timestamp) 
    });
  } catch (error) {
    console.error('Error fetching generation records:', error);
    res.status(500).json({ error: 'Failed to fetch generation records' });
  }
});

app.get('/api/generation-records/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const db = loadGenerationRecords();
    
    const userRecords = db.records.filter(record => record.userId === userId);

    res.json({ 
      success: true, 
      records: userRecords.sort((a, b) => b.timestamp - a.timestamp) 
    });
  } catch (error) {
    console.error('Error fetching user generation records:', error);
    res.status(500).json({ error: 'Failed to fetch user generation records' });
  }
});

app.post('/api/register', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const usersDb = loadUsers();
    
    if (usersDb.users.some(user => user.email === email)) {
      return res.status(400).json({ error: '该邮箱已被注册' });
    }
    
    if (usersDb.users.some(user => user.name === name)) {
      return res.status(400).json({ error: '该用户名已被使用' });
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashPassword(password),
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      credits: 100,
      joinedAt: Date.now()
    };

    usersDb.users.push(newUser);
    saveUsers(usersDb);

    res.json({ 
      success: true, 
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        credits: newUser.credits,
        joinedAt: newUser.joinedAt
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: '注册失败，请稍后重试' });
  }
});

app.post('/api/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const usersDb = loadUsers();
    const user = usersDb.users.find(user => user.email === email);

    if (!user) {
      return res.status(401).json({ error: '用户不存在' });
    }

    if (user.password !== hashPassword(password)) {
      return res.status(401).json({ error: '密码错误' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        joinedAt: user.joinedAt
      }
    });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ error: '登录失败，请稍后重试' });
  }
});

app.get('/api/user/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const usersDb = loadUsers();
    const user = usersDb.users.find(user => user.id === userId);

    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }

    res.json({ 
      success: true, 
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        credits: user.credits,
        joinedAt: user.joinedAt
      }
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: '获取用户信息失败' });
  }
});

app.put('/api/user/:userId/credits', (req, res) => {
  try {
    const { userId } = req.params;
    const { credits } = req.body;

    if (typeof credits !== 'number') {
      return res.status(400).json({ error: 'Invalid credits value' });
    }

    const usersDb = loadUsers();
    const userIndex = usersDb.users.findIndex(user => user.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: '用户不存在' });
    }

    usersDb.users[userIndex].credits = credits;
    saveUsers(usersDb);

    res.json({ 
      success: true, 
      credits: credits
    });
  } catch (error) {
    console.error('Error updating user credits:', error);
    res.status(500).json({ error: '更新用户积分失败' });
  }
});

app.post('/api/payment/create', async (req, res) => {
  try {
    const { userId, packageId, amount, subject, credits } = req.body;

    if (!userId || !amount) {
      return res.status(400).json({ error: '缺少必要参数' });
    }

    const outTradeNo = Date.now().toString();
    const ordersDb = loadOrders();
    
    const order = {
      id: outTradeNo,
      userId,
      packageId,
      amount: parseFloat(amount),
      credits: credits || 0,
      subject: subject || '充值积分',
      status: 'pending',
      createdAt: Date.now()
    };

    ordersDb.orders.push(order);
    saveOrders(ordersDb);

    const bizContent = {
      out_trade_no: outTradeNo,
      total_amount: amount,
      subject: subject || '充值积分',
      product_code: 'FACE_TO_FACE_PAYMENT',
      body: `充值${amount}积分`,
      timeout_express: '30m',
      notify_url: `http://localhost:3001/api/payment/notify`
    };

    const result = await alipaySdk.exec('alipay.trade.precreate', bizContent);

    if (result.alipay_trade_precreate_response?.code !== '10000') {
      console.error('Alipay API error:', result);
      return res.status(500).json({ 
        error: result.alipay_trade_precreate_response?.sub_msg || '创建支付订单失败' 
      });
    }

    const qrCode = result.alipay_trade_precreate_response.qr_code;

    res.json({ 
      success: true, 
      orderId: outTradeNo,
      qrCode: qrCode
    });
  } catch (error) {
    console.error('Error creating payment:', error);
    res.status(500).json({ error: '创建支付订单失败' });
  }
});

app.post('/api/payment/notify', (req, res) => {
  try {
    const params = req.body;
    const signVerified = alipaySdk.checkNotifySign(params);

    if (!signVerified) {
      return res.send('fail');
    }

    const { out_trade_no, trade_status, total_amount } = params;
    const ordersDb = loadOrders();
    const orderIndex = ordersDb.orders.findIndex(order => order.id === out_trade_no);

    if (orderIndex === -1) {
      return res.send('fail');
    }

    const order = ordersDb.orders[orderIndex];

    if (trade_status === 'TRADE_SUCCESS' && order.status === 'pending') {
      const usersDb = loadUsers();
      const userIndex = usersDb.users.findIndex(user => user.id === order.userId);

      if (userIndex !== -1) {
        usersDb.users[userIndex].credits += parseFloat(total_amount);
        saveUsers(usersDb);
      }

      ordersDb.orders[orderIndex].status = 'success';
      ordersDb.orders[orderIndex].tradeNo = params.trade_no;
      saveOrders(ordersDb);
    }

    res.send('success');
  } catch (error) {
    console.error('Error processing payment notify:', error);
    res.send('fail');
  }
});

app.get('/api/payment/query/:orderId', (req, res) => {
  try {
    const { orderId } = req.params;
    const ordersDb = loadOrders();
    const order = ordersDb.orders.find(o => o.id === orderId);

    if (!order) {
      return res.status(404).json({ error: '订单不存在' });
    }

    res.json({ 
      success: true, 
      order: {
        id: order.id,
        amount: order.amount,
        status: order.status,
        subject: order.subject,
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Error querying payment:', error);
    res.status(500).json({ error: '查询支付订单失败' });
  }
});

app.get('/api/images/:imageId', (req, res) => {
  try {
    const { imageId } = req.params;
    const fileName = `${imageId}.png`;
    const filePath = path.join(IMAGES_DIR, fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('Error serving image:', error);
    res.status(500).json({ error: 'Failed to serve image' });
  }
});

const ADMIN_EMAIL = '172311284@qq.com';

const isAdmin = (email) => {
  return email === ADMIN_EMAIL;
};

app.get('/api/admin/stats', (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !isAdmin(email)) {
      return res.status(403).json({ error: '无权访问' });
    }

    const generationDb = loadGenerationRecords();
    const usersDb = loadUsers();
    const ordersDb = loadOrders();

    const now = Date.now();
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayStartTime = todayStart.getTime();

    const todayRecords = generationDb.records.filter(r => r.timestamp >= todayStartTime);
    const todayRecordsSuccess = todayRecords.filter(r => r.success !== false);

    const todayOrders = ordersDb.orders.filter(o => o.createdAt >= todayStartTime && o.status === 'success');
    const todayNewUsers = usersDb.users.filter(u => u.joinedAt >= todayStartTime);

    const totalRecordsSuccess = generationDb.records.filter(r => r.success !== false);
    const totalOrdersSuccess = ordersDb.orders.filter(o => o.status === 'success');

    const moduleUsageMap = {};
    generationDb.records.forEach(record => {
      const moduleName = record.moduleName || 'Unknown';
      if (!moduleUsageMap[moduleName]) {
        moduleUsageMap[moduleName] = 0;
      }
      moduleUsageMap[moduleName]++;
    });

    const moduleUsage = Object.entries(moduleUsageMap).map(([moduleName, count]) => ({
      moduleName,
      count
    })).sort((a, b) => b.count - a.count);

    const todayTotalCredits = todayRecords.reduce((sum, r) => sum + (r.credits || 0), 0);
    const totalCredits = generationDb.records.reduce((sum, r) => sum + (r.credits || 0), 0);

    const todayTotalRechargeAmount = todayOrders.reduce((sum, o) => sum + o.amount, 0);
    const totalRechargeAmount = totalOrdersSuccess.reduce((sum, o) => sum + o.amount, 0);

    const todayTotalRechargeCredits = todayOrders.reduce((sum, o) => sum + (o.credits || 0), 0);
    const totalRechargeCredits = totalOrdersSuccess.reduce((sum, o) => sum + (o.credits || 0), 0);

    const rechargeRecords = ordersDb.orders.map(order => {
      const user = usersDb.users.find(u => u.id === order.userId);
      return {
        id: order.id,
        userId: order.userId,
        userName: user?.name || '',
        userEmail: user?.email || '',
        amount: order.amount,
        credits: order.credits || 0,
        status: order.status,
        createdAt: order.createdAt
      };
    }).sort((a, b) => b.createdAt - a.createdAt);

    const recentGenerations = generationDb.records.map(record => {
      const user = usersDb.users.find(u => u.id === record.userId);
      return {
        id: record.id,
        userId: record.userId,
        userName: user?.name || '',
        userEmail: user?.email || '',
        moduleName: record.moduleName || '',
        model: record.model || '',
        prompt: record.prompt || '',
        resolution: record.resolution || '',
        aspectRatio: record.aspectRatio || '',
        imageSize: record.imageSize || '',
        success: record.success !== false,
        credits: record.credits || 0,
        createdAt: record.timestamp
      };
    }).sort((a, b) => b.createdAt - a.createdAt).slice(0, 100);

    const stats = {
      today: {
        totalImages: todayRecords.length,
        successImages: todayRecordsSuccess.length,
        successRate: todayRecords.length > 0 ? (todayRecordsSuccess.length / todayRecords.length * 100).toFixed(2) : 0,
        totalCredits: todayTotalCredits,
        newUsers: todayNewUsers.length,
        totalRechargeAmount: todayTotalRechargeAmount,
        totalRechargeCredits: todayTotalRechargeCredits
      },
      total: {
        totalImages: generationDb.records.length,
        successImages: totalRecordsSuccess.length,
        successRate: generationDb.records.length > 0 ? (totalRecordsSuccess.length / generationDb.records.length * 100).toFixed(2) : 0,
        totalCredits: totalCredits,
        totalUsers: usersDb.users.length,
        totalRechargeAmount: totalRechargeAmount,
        totalRechargeCredits: totalRechargeCredits
      },
      moduleUsage,
      rechargeRecords,
      recentGenerations
    };

    res.json({ success: true, stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ error: '获取统计数据失败' });
  }
});

app.get('/api/admin/recharge-records', (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !isAdmin(email)) {
      return res.status(403).json({ error: '无权访问' });
    }

    const ordersDb = loadOrders();
    const usersDb = loadUsers();

    const records = ordersDb.orders.map(order => {
      const user = usersDb.users.find(u => u.id === order.userId);
      return {
        id: order.id,
        userId: order.userId,
        userName: user?.name || '',
        userEmail: user?.email || '',
        amount: order.amount,
        credits: order.credits || 0,
        status: order.status,
        createdAt: order.createdAt
      };
    }).sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching recharge records:', error);
    res.status(500).json({ error: '获取充值记录失败' });
  }
});

app.get('/api/admin/generation-records', (req, res) => {
  try {
    const { email } = req.query;

    if (!email || !isAdmin(email)) {
      return res.status(403).json({ error: '无权访问' });
    }

    const generationDb = loadGenerationRecords();
    const usersDb = loadUsers();

    const records = generationDb.records.map(record => {
      const user = usersDb.users.find(u => u.id === record.userId);
      return {
        id: record.id,
        userId: record.userId,
        userName: user?.name || '',
        userEmail: user?.email || '',
        moduleName: record.moduleName || '',
        model: record.model || '',
        prompt: record.prompt || '',
        resolution: record.resolution || '',
        aspectRatio: record.aspectRatio || '',
        imageSize: record.imageSize || '',
        success: record.success !== false,
        credits: record.credits || 0,
        createdAt: record.timestamp
      };
    }).sort((a, b) => b.createdAt - a.createdAt);

    res.json({ success: true, records });
  } catch (error) {
    console.error('Error fetching generation records:', error);
    res.status(500).json({ error: '获取生成记录失败' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Images will be saved to: ${IMAGES_DIR}`);
  console.log(`Generation records will be saved to: ${GENERATION_RECORDS_FILE}`);
  console.log(`Users will be saved to: ${USERS_FILE}`);
});
