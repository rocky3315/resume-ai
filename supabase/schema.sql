-- 用户表 (使用 Supabase Auth，此表存储额外信息)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 简历表
CREATE TABLE IF NOT EXISTS resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'modern',
  target_job TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 分享简历表
CREATE TABLE IF NOT EXISTS shared_resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  share_code TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  resume_id UUID REFERENCES resumes(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template TEXT DEFAULT 'modern',
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_shared_resumes_share_code ON shared_resumes(share_code);
CREATE INDEX IF NOT EXISTS idx_shared_resumes_user_id ON shared_resumes(user_id);

-- RLS (Row Level Security) 策略
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_resumes ENABLE ROW LEVEL SECURITY;

-- profiles 策略
CREATE POLICY "用户可以查看自己的资料" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "用户可以更新自己的资料" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "用户可以插入自己的资料" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- resumes 策略
CREATE POLICY "用户可以查看自己的简历" ON resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以插入自己的简历" ON resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以更新自己的简历" ON resumes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的简历" ON resumes
  FOR DELETE USING (auth.uid() = user_id);

-- shared_resumes 策略
CREATE POLICY "用户可以查看自己的分享" ON shared_resumes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "用户可以创建分享" ON shared_resumes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "用户可以删除自己的分享" ON shared_resumes
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "任何人可以通过分享码查看分享的简历" ON shared_resumes
  FOR SELECT USING (share_code IS NOT NULL);

-- 触发器：自动更新 updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_resumes_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 触发器：新用户注册时自动创建 profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
