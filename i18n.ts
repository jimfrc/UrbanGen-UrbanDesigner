export type Language = 'zh' | 'en';

export interface Translations {
  common: {
    startDesigning: string;
    viewGallery: string;
    login: string;
    signUp: string;
    logout: string;
    profile: string;
    recharge: string;
    credits: string;
    home: string;
    generatorHub: string;
    gallery: string;
    language: string;
    adminDashboard: string;
  };
  modules: {
    aiRendering: {
      title: string;
      description: string;
    };
    nodeScene: {
      title: string;
      description: string;
    };
    analysisDiagram: {
      title: string;
      description: string;
    };
    explodedViewDiagram: {
      title: string;
      description: string;
    };
    figureGroundDiagram: {
      title: string;
      description: string;
    };
    renovationDesign: {
      title: string;
      description: string;
    };
  };
  home: {
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    startDesigning: string;
    features: {
      title: string;
      items: string[];
    };
    modules: {
      title: string;
      subtitle: string;
    };
  };
  generatorHub: {
    title: string;
    subtitle: string;
    selectModule: string;
  };
  generatorWorkspace: {
    promptPlaceholder: string;
    model: string;
    resolution: string;
    aspectRatio: string;
    imageSize: string;
    generate: string;
    generating: string;
    uploadImage: string;
    referenceImage: string;
    removeImage: string;
  };
  gallery: {
    title: string;
    subtitle: string;
    empty: string;
  };
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    login: string;
    noAccount: string;
    signUp: string;
  };
  signUp: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    signUp: string;
    hasAccount: string;
    login: string;
  };
  profile: {
    title: string;
    personalWorkshop: string;
    totalImages: string;
    totalCredits: string;
    joinDate: string;
    empty: string;
  };
  recharge: {
    title: string;
    subtitle: string;
    currentCredits: string;
    selectPackage: string;
    pay: string;
    success: string;
    error: string;
  };
  adminDashboard: {
    title: string;
    todayStats: string;
    totalStats: string;
    totalImages: string;
    successImages: string;
    successRate: string;
    totalCredits: string;
    newUsers: string;
    totalRechargeAmount: string;
    totalRechargeCredits: string;
    totalUsers: string;
    moduleUsage: string;
    rechargeRecords: string;
    generationRecords: string;
    loading: string;
    error: string;
    status: string;
    user: string;
    amount: string;
    credits: string;
    time: string;
    moduleName: string;
    model: string;
    prompt: string;
  };
}

export const translations: Record<Language, Translations> = {
  zh: {
    common: {
      startDesigning: '开始设计',
      viewGallery: '查看图库',
      login: '登录',
      signUp: '注册',
      logout: '退出',
      profile: '个人中心',
      recharge: '充值',
      credits: '积分',
      home: '首页',
      generatorHub: '设计中心',
      gallery: '图库',
      language: '语言',
      adminDashboard: '管理员控制台'
    },
    home: {
      heroTitle: '重塑未来城市',
      heroSubtitle: 'UrbanGen Designer',
      heroDescription: '利用先进AI技术，创造令人惊叹的城市设计',
      startDesigning: '开始设计',
      features: {
        title: '核心功能',
        items: [
          '智能生成高质量图像',
          '多种专业设计模板',
          '灵活的参数控制',
          '实时预览效果'
        ]
      },
      modules: {
        title: '设计模块',
        subtitle: '选择适合您的设计模块开始创作'
      }
    },
    modules: {
      aiRendering: {
        title: 'AI渲染',
        description: '生成城市环境或建筑设计的商业效果图。'
      },
      nodeScene: {
        title: '节点场景表示',
        description: '根据图纸选择点，切换到所选点位置视图，并保持对象一致性。'
      },
      analysisDiagram: {
        title: '分析图',
        description: '根据设计要求绘制相应的场景分析图。'
      },
      explodedViewDiagram: {
        title: '爆炸图',
        description: '专注于建筑的爆炸视图，分析其结构和空间。'
      },
      figureGroundDiagram: {
        title: '图底图',
        description: '根据设计要求绘制图底图。'
      },
      renovationDesign: {
        title: '改造设计',
        description: '针对现场和航拍摄影，根据现有条件进行修改和设计。'
      }
    },
    generatorHub: {
      title: '设计中心',
      subtitle: '选择您的设计模块',
      selectModule: '选择模块'
    },
    generatorWorkspace: {
      promptPlaceholder: '描述您想要的设计...',
      model: '模型',
      resolution: '分辨率',
      aspectRatio: '宽高比',
      imageSize: '图像尺寸',
      generate: '生成图像',
      generating: '生成中...',
      uploadImage: '上传参考图',
      referenceImage: '参考图像',
      removeImage: '移除图像'
    },
    gallery: {
      title: '社区图库',
      subtitle: '探索由Nano Banana Pro引擎创建的设计',
      empty: '暂无图像，开始创作吧！'
    },
    login: {
      title: '登录',
      subtitle: '欢迎回来',
      email: '邮箱',
      password: '密码',
      login: '登录',
      noAccount: '还没有账号？',
      signUp: '立即注册'
    },
    signUp: {
      title: '注册',
      subtitle: '创建您的账号',
      name: '用户名',
      email: '邮箱',
      password: '密码',
      confirmPassword: '确认密码',
      signUp: '注册',
      hasAccount: '已有账号？',
      login: '立即登录'
    },
    profile: {
      title: '个人中心',
      personalWorkshop: '个人工作坊',
      totalImages: '总图像数',
      totalCredits: '总积分',
      joinDate: '加入时间',
      empty: '暂无图像，开始创作吧！'
    },
    recharge: {
      title: '充值',
      subtitle: '选择充值套餐',
      currentCredits: '当前积分',
      selectPackage: '选择套餐',
      pay: '支付',
      success: '充值成功！',
      error: '充值失败，请重试'
    },
    adminDashboard: {
      title: '管理员控制台',
      todayStats: '今日统计',
      totalStats: '总计统计',
      totalImages: '总图像数',
      successImages: '成功图像数',
      successRate: '成功率',
      totalCredits: '消耗积分',
      newUsers: '新用户数',
      totalRechargeAmount: '充值金额',
      totalRechargeCredits: '充值积分',
      totalUsers: '总用户数',
      moduleUsage: '模块使用情况',
      rechargeRecords: '充值记录',
      generationRecords: '生成记录',
      loading: '加载中...',
      error: '加载数据失败',
      status: '状态',
      user: '用户',
      amount: '金额',
      credits: '积分',
      time: '时间',
      moduleName: '模块',
      model: '模型',
      prompt: '提示词'
    }
  },
  en: {
    common: {
      startDesigning: 'Start Designing',
      viewGallery: 'View Gallery',
      login: 'Login',
      signUp: 'Sign Up',
      logout: 'Logout',
      profile: 'Profile',
      recharge: 'Recharge',
      credits: 'Credits',
      home: 'Home',
      generatorHub: 'Design Hub',
      gallery: 'Gallery',
      language: 'Language',
      adminDashboard: 'Admin Dashboard'
    },
    home: {
      heroTitle: 'Reshape the Future City',
      heroSubtitle: 'UrbanGen Designer',
      heroDescription: 'Create stunning urban designs with advanced AI technology',
      startDesigning: 'Start Designing',
      features: {
        title: 'Core Features',
        items: [
          'Intelligent high-quality image generation',
          'Multiple professional design templates',
          'Flexible parameter control',
          'Real-time preview effects'
        ]
      },
      modules: {
        title: 'Design Modules',
        subtitle: 'Select a design module to start creating'
      }
    },
    modules: {
      aiRendering: {
        title: 'AI Rendering',
        description: 'Generate commercial renderings of urban environments or architectural designs.'
      },
      nodeScene: {
        title: 'Node Scene Representation',
        description: 'Select points according to drawing, switch to view to selected point location, and maintain object consistency.'
      },
      analysisDiagram: {
        title: 'Analysis Diagram',
        description: 'Draw corresponding scene analysis diagram according to design requirements.'
      },
      explodedViewDiagram: {
        title: 'Exploded View Diagram',
        description: 'Focus on exploded view of building, analyzing its structure and space.'
      },
      figureGroundDiagram: {
        title: 'Figure-Ground Diagram',
        description: 'Draw figure-ground diagram according to design requirements.'
      },
      renovationDesign: {
        title: 'Renovation Design',
        description: 'For on-site and aerial photography, undertake modifications and designs based on existing conditions.'
      }
    },
    generatorHub: {
      title: 'Design Hub',
      subtitle: 'Select your design module',
      selectModule: 'Select Module'
    },
    generatorWorkspace: {
      promptPlaceholder: 'Describe your desired design...',
      model: 'Model',
      resolution: 'Resolution',
      aspectRatio: 'Aspect Ratio',
      imageSize: 'Image Size',
      generate: 'Generate Image',
      generating: 'Generating...',
      uploadImage: 'Upload Reference Image',
      referenceImage: 'Reference Image',
      removeImage: 'Remove Image'
    },
    gallery: {
      title: 'Community Gallery',
      subtitle: 'Explore designs created by the Nano Banana Pro engine',
      empty: 'No images yet, start creating!'
    },
    login: {
      title: 'Login',
      subtitle: 'Welcome back',
      email: 'Email',
      password: 'Password',
      login: 'Login',
      noAccount: "Don't have an account?",
      signUp: 'Sign Up Now'
    },
    signUp: {
      title: 'Sign Up',
      subtitle: 'Create your account',
      name: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      signUp: 'Sign Up',
      hasAccount: 'Already have an account?',
      login: 'Login Now'
    },
    profile: {
      title: 'Profile',
      personalWorkshop: 'Personal Workshop',
      totalImages: 'Total Images',
      totalCredits: 'Total Credits',
      joinDate: 'Join Date',
      empty: 'No images yet, start creating!'
    },
    recharge: {
      title: 'Recharge',
      subtitle: 'Select a recharge package',
      currentCredits: 'Current Credits',
      selectPackage: 'Select Package',
      pay: 'Pay',
      success: 'Recharge successful!',
      error: 'Recharge failed, please try again'
    },
    adminDashboard: {
      title: 'Admin Dashboard',
      todayStats: 'Today\'s Statistics',
      totalStats: 'Total Statistics',
      totalImages: 'Total Images',
      successImages: 'Success Images',
      successRate: 'Success Rate',
      totalCredits: 'Consumed Credits',
      newUsers: 'New Users',
      totalRechargeAmount: 'Recharge Amount',
      totalRechargeCredits: 'Recharge Credits',
      totalUsers: 'Total Users',
      moduleUsage: 'Module Usage',
      rechargeRecords: 'Recharge Records',
      generationRecords: 'Generation Records',
      loading: 'Loading...',
      error: 'Failed to load data',
      status: 'Status',
      user: 'User',
      amount: 'Amount',
      credits: 'Credits',
      time: 'Time',
      moduleName: 'Module',
      model: 'Model',
      prompt: 'Prompt'
    }
  }
};
